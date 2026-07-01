"use server";

import { db } from "@/db";
import { blogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { requireUser } from "@/lib/auth";

export type BlogFormState = { error: string } | null;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Accepts a yyyy-MM-dd date input and stores a human-readable string. */
function normalizeDate(rawDate: string): string | null {
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return null;
  const utc = new Date(parsed.getTime() + parsed.getTimezoneOffset() * 60000);
  return format(utc, "MMMM d, yyyy");
}

type ParsedBlog = {
  title: string;
  slug: string;
  date: string;
  excerpt: string | null;
  author: string | null;
  authorRole: string | null;
  category: string | null;
  readTime: string | null;
  thumbnail: string | null;
  content: string;
};

type ParseResult =
  | { ok: true; values: ParsedBlog }
  | { ok: false; error: string };

function parseBlogForm(formData: FormData): ParseResult {
  const title = (formData.get("title") as string)?.trim();
  const rawSlug = (formData.get("slug") as string)?.trim();
  const rawDate = (formData.get("date") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const author = (formData.get("author") as string)?.trim() || null;
  const authorRole = (formData.get("authorRole") as string)?.trim() || null;
  const category = (formData.get("category") as string)?.trim() || null;
  const readTime = (formData.get("readTime") as string)?.trim() || null;
  const thumbnail = (formData.get("thumbnail") as string)?.trim() || null;
  const content = (formData.get("content") as string) ?? "";

  if (!title) return { ok: false, error: "Title is required." };
  if (!rawDate) return { ok: false, error: "Date is required." };
  if (!content.trim()) return { ok: false, error: "Content is required." };

  const date = normalizeDate(rawDate);
  if (!date) return { ok: false, error: "Date is invalid." };

  const slug = rawSlug ? slugify(rawSlug) : slugify(title);
  if (!slug) return { ok: false, error: "Could not derive a valid slug." };

  return {
    ok: true,
    values: {
      title,
      slug,
      date,
      excerpt,
      author,
      authorRole,
      category,
      readTime,
      thumbnail,
      content,
    },
  };
}

function revalidateBlog(slug: string) {
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${slug}`);
  revalidatePath("/admin/blogs");
  revalidatePath("/sitemap.xml");
}

export async function createBlog(
  _prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  await requireUser();

  const parsed = parseBlogForm(formData);
  if (!parsed.ok) return { error: parsed.error };
  const { values } = parsed;

  const existing = await db
    .select({ id: blogs.id })
    .from(blogs)
    .where(eq(blogs.slug, values.slug))
    .limit(1);
  if (existing.length > 0) {
    return { error: `A blog with the slug "${values.slug}" already exists.` };
  }

  try {
    await db.insert(blogs).values(values);
  } catch (error) {
    console.error("Failed to create blog:", error);
    return { error: "Failed to create blog. Please try again." };
  }

  revalidateBlog(values.slug);
  redirect("/admin/blogs");
}

export async function updateBlog(
  _prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  await requireUser();

  const originalSlug = (formData.get("originalSlug") as string)?.trim();
  if (!originalSlug) return { error: "Missing blog reference." };

  const parsed = parseBlogForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  // Slug is the identifier for the public URL — keep it fixed on edit.
  const { title, date, excerpt, author, authorRole, category, readTime, thumbnail, content } =
    parsed.values;

  try {
    const updated = await db
      .update(blogs)
      .set({ title, date, excerpt, author, authorRole, category, readTime, thumbnail, content })
      .where(eq(blogs.slug, originalSlug))
      .returning({ slug: blogs.slug });

    if (updated.length === 0) {
      return { error: "Blog not found." };
    }
  } catch (error) {
    console.error("Failed to update blog:", error);
    return { error: "Failed to update blog. Please try again." };
  }

  revalidateBlog(originalSlug);
  redirect("/admin/blogs");
}

export async function deleteBlog(formData: FormData) {
  await requireUser();

  const slug = (formData.get("slug") as string)?.trim();
  if (!slug) return;

  try {
    await db.delete(blogs).where(eq(blogs.slug, slug));
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return;
  }

  revalidateBlog(slug);
}
