"use server";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  type FormField,
  slugify,
  validateFields,
} from "@/lib/form-fields";

export type FormBuilderState = { error: string } | null;

type ParsedForm = {
  slug: string;
  title: string;
  description: string | null;
  fields: FormField[];
  isActive: boolean;
};

type ParseResult =
  | { ok: true; values: ParsedForm }
  | { ok: false; error: string };

function parseFormBuilder(formData: FormData): ParseResult {
  const title = (formData.get("title") as string)?.trim();
  const rawSlug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const isActive = formData.get("isActive") === "on";
  const rawFields = (formData.get("fields") as string) ?? "[]";

  if (!title) return { ok: false, error: "Title is required." };

  const slug = rawSlug ? slugify(rawSlug) : slugify(title);
  if (!slug) return { ok: false, error: "Could not derive a valid slug." };

  let parsedFields: unknown;
  try {
    parsedFields = JSON.parse(rawFields);
  } catch {
    return { ok: false, error: "The form fields are malformed." };
  }
  if (!Array.isArray(parsedFields)) {
    return { ok: false, error: "The form fields are malformed." };
  }

  const fields = parsedFields as FormField[];
  const fieldError = validateFields(fields);
  if (fieldError) return { ok: false, error: fieldError };

  return {
    ok: true,
    values: { slug, title, description, fields, isActive },
  };
}

function revalidateForm(slug: string) {
  revalidatePath("/admin/forms");
  revalidatePath(`/forms/${slug}`);
}

export async function createForm(
  _prevState: FormBuilderState,
  formData: FormData
): Promise<FormBuilderState> {
  await requireUser();

  const parsed = parseFormBuilder(formData);
  if (!parsed.ok) return { error: parsed.error };
  const { values } = parsed;

  const existing = await db
    .select({ id: forms.id })
    .from(forms)
    .where(eq(forms.slug, values.slug))
    .limit(1);
  if (existing.length > 0) {
    return { error: `A form with the slug "${values.slug}" already exists.` };
  }

  try {
    await db.insert(forms).values(values);
  } catch (error) {
    console.error("Failed to create form:", error);
    return { error: "Failed to create form. Please try again." };
  }

  revalidateForm(values.slug);
  redirect("/admin/forms");
}

export async function updateForm(
  _prevState: FormBuilderState,
  formData: FormData
): Promise<FormBuilderState> {
  await requireUser();

  const originalSlug = (formData.get("originalSlug") as string)?.trim();
  if (!originalSlug) return { error: "Missing form reference." };

  const parsed = parseFormBuilder(formData);
  if (!parsed.ok) return { error: parsed.error };

  // Slug identifies submissions and the public URL — keep it fixed on edit.
  const { title, description, fields, isActive } = parsed.values;

  try {
    const updated = await db
      .update(forms)
      .set({ title, description, fields, isActive })
      .where(eq(forms.slug, originalSlug))
      .returning({ slug: forms.slug });

    if (updated.length === 0) {
      return { error: "Form not found." };
    }
  } catch (error) {
    console.error("Failed to update form:", error);
    return { error: "Failed to update form. Please try again." };
  }

  revalidateForm(originalSlug);
  redirect("/admin/forms");
}

export async function deleteForm(formData: FormData) {
  await requireUser();

  const slug = (formData.get("slug") as string)?.trim();
  if (!slug) return;

  try {
    await db.delete(forms).where(eq(forms.slug, slug));
  } catch (error) {
    console.error("Failed to delete form:", error);
    return;
  }

  revalidateForm(slug);
}
