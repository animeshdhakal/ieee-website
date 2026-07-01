"use server";

import { db } from "@/db";
import { formSubmissions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getFormBySlug } from "@/lib/forms";
import { type FormField, isFieldVisible } from "@/lib/form-fields";

/** Public bucket that dynamic-form file uploads are stored in. */
const FORM_UPLOAD_BUCKET = "form-uploads";

export type DynamicFormState =
  | { error: string }
  | { success: true; message: string }
  | null;

async function uploadFile(field: FormField, file: File): Promise<string> {
  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${field.name}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from(FORM_UPLOAD_BUCKET)
    .upload(fileName, file);

  if (error) {
    console.error("Storage error:", error);
    throw new Error(
      `Failed to upload "${field.label}". Ensure the "${FORM_UPLOAD_BUCKET}" storage bucket exists and is public.`
    );
  }

  return fileName;
}

/**
 * Handles submissions for any admin-built form. Validates the payload against
 * the stored field schema so a tampered client can't bypass required fields.
 */
export async function submitDynamicForm(
  _prevState: DynamicFormState,
  formData: FormData
): Promise<DynamicFormState> {
  try {
    const slug = formData.get("formId") as string;
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();

    if (!slug) return { error: "Missing form reference." };
    if (!name || !email) return { error: "Name and email are required." };

    const form = await getFormBySlug(slug);
    if (!form || !form.isActive) {
      return { error: "This form is no longer accepting responses." };
    }

    const existing = await db
      .select({ id: formSubmissions.id })
      .from(formSubmissions)
      .where(and(eq(formSubmissions.formId, slug), eq(formSubmissions.email, email)))
      .limit(1);
    if (existing.length > 0) {
      return { error: "You have already submitted this form with this email." };
    }

    const fields = (form.fields ?? []) as FormField[];

    // Read every raw value first so field conditions can be evaluated.
    const raw: Record<string, string | boolean | File> = {};
    for (const field of fields) {
      if (field.type === "checkbox") {
        raw[field.name] = formData.get(field.name) === "on";
      } else if (field.type === "file") {
        const file = formData.get(field.name) as File | null;
        raw[field.name] = file && file.size > 0 ? file : "";
      } else {
        raw[field.name] = (formData.get(field.name) as string)?.trim() ?? "";
      }
    }

    // Resolve visibility in order so a hidden controller cascades to its
    // dependents — mirrors the client so hidden required fields don't block.
    const effective: Record<string, unknown> = { ...raw };
    const isVisible = new Map<string, boolean>();
    for (const field of fields) {
      const visible = isFieldVisible(field, effective);
      isVisible.set(field.name, visible);
      if (!visible) delete effective[field.name];
    }

    const collected: Record<string, unknown> = {};
    for (const field of fields) {
      if (!isVisible.get(field.name)) continue;
      const value = raw[field.name];

      if (field.type === "file") {
        const hasFile = value instanceof File && value.size > 0;
        if (field.required && !hasFile) {
          return { error: `"${field.label}" is required.` };
        }
        if (hasFile) {
          collected[field.name] = await uploadFile(field, value);
        }
        continue;
      }

      if (field.type === "checkbox") {
        const checked = value === true;
        if (field.required && !checked) {
          return { error: `"${field.label}" is required.` };
        }
        collected[field.name] = checked;
        continue;
      }

      const str = typeof value === "string" ? value : "";
      if (field.required && !str) {
        return { error: `"${field.label}" is required.` };
      }
      if (field.type === "select" && str && !field.options?.includes(str)) {
        return { error: `"${str}" is not a valid option for "${field.label}".` };
      }
      collected[field.name] = str;
    }

    await db.insert(formSubmissions).values({
      formId: slug,
      name,
      email,
      formData: collected,
    });

    revalidatePath(`/admin/forms/${slug}/submissions`);

    return { success: true, message: "Your response has been recorded." };
  } catch (error) {
    console.error("Failed to submit form:", error);
    const message =
      error instanceof Error ? error.message : "Failed to submit. Please try again.";
    return { error: message };
  }
}
