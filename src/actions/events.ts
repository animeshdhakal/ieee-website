"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { requireUser } from "@/lib/auth";

export type EventFormState = { error: string } | null;

const CATEGORIES = ["Workshop", "Seminar", "Competition", "Social"];

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
  // Use UTC parts so a yyyy-MM-dd value isn't shifted by the local timezone.
  const utc = new Date(parsed.getTime() + parsed.getTimezoneOffset() * 60000);
  return format(utc, "MMMM d, yyyy");
}

type ParsedEvent = {
  title: string;
  slug: string;
  date: string;
  category: string;
  location: string | null;
  description: string | null;
  thumbnail: string | null;
  registrationUrl: string | null;
  content: string;
  isUpcoming: boolean;
};

type ParseResult =
  | { ok: true; values: ParsedEvent }
  | { ok: false; error: string };

function parseEventForm(formData: FormData): ParseResult {
  const title = (formData.get("title") as string)?.trim();
  const rawSlug = (formData.get("slug") as string)?.trim();
  const rawDate = (formData.get("date") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const location = (formData.get("location") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const thumbnail = (formData.get("thumbnail") as string)?.trim() || null;
  const registrationUrl =
    (formData.get("registrationUrl") as string)?.trim() || null;
  const content = (formData.get("content") as string) ?? "";
  const isUpcoming = formData.get("isUpcoming") === "on";

  if (!title) return { ok: false, error: "Title is required." };
  if (!rawDate) return { ok: false, error: "Date is required." };
  if (!category || !CATEGORIES.includes(category)) {
    return { ok: false, error: "A valid category is required." };
  }
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
      category,
      location,
      description,
      thumbnail,
      registrationUrl,
      content,
      isUpcoming,
    },
  };
}

function revalidateEvent(slug: string) {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath("/sitemap.xml");
}

export async function createEvent(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await requireUser();

  const parsed = parseEventForm(formData);
  if (!parsed.ok) return { error: parsed.error };
  const { values } = parsed;

  const existing = await db
    .select({ id: events.id })
    .from(events)
    .where(eq(events.slug, values.slug))
    .limit(1);
  if (existing.length > 0) {
    return { error: `An event with the slug "${values.slug}" already exists.` };
  }

  try {
    await db.insert(events).values(values);
  } catch (error) {
    console.error("Failed to create event:", error);
    return { error: "Failed to create event. Please try again." };
  }

  revalidateEvent(values.slug);
  redirect("/admin/events");
}

export async function updateEvent(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await requireUser();

  const originalSlug = (formData.get("originalSlug") as string)?.trim();
  if (!originalSlug) return { error: "Missing event reference." };

  const parsed = parseEventForm(formData);
  if (!parsed.ok) return { error: parsed.error };
  const { values } = parsed;

  // Slug is the identifier for submissions and URLs — keep it fixed on edit.
  const { slug: _ignored, ...updatable } = values;

  try {
    const updated = await db
      .update(events)
      .set(updatable)
      .where(eq(events.slug, originalSlug))
      .returning({ slug: events.slug });

    if (updated.length === 0) {
      return { error: "Event not found." };
    }
  } catch (error) {
    console.error("Failed to update event:", error);
    return { error: "Failed to update event. Please try again." };
  }

  revalidateEvent(originalSlug);
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  await requireUser();

  const slug = (formData.get("slug") as string)?.trim();
  if (!slug) return;

  try {
    await db.delete(events).where(eq(events.slug, slug));
  } catch (error) {
    console.error("Failed to delete event:", error);
    return;
  }

  revalidateEvent(slug);
  revalidatePath("/admin/events");
}
