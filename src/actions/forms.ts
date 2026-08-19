"use server";

import { db } from "@/db";
import { formSubmissions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getFormBySlug } from "@/lib/forms";
import { type FormField, isFieldVisible } from "@/lib/form-fields";
import fs from "fs/promises";
import path from "path";

export type DynamicFormState =
  | { error: string }
  | { success: true; message: string }
  | null;

async function uploadFile(field: FormField, file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const fileExt = file.name.split(".").pop() || "bin";
  const fileName = `${field.name}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;

  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

/**
 * Handles submissions for any dynamic form and stores response in PostgreSQL DB.
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

    // Read raw values first
    const raw: Record<string, string | boolean | File> = {};
    for (const field of fields) {
      if (field.type === "section") continue;
      if (field.type === "checkbox") {
        raw[field.name] = formData.get(field.name) === "on";
      } else if (field.type === "file") {
        const file = formData.get(field.name) as File | null;
        raw[field.name] = file && file.size > 0 ? file : "";
      } else {
        raw[field.name] = (formData.get(field.name) as string)?.trim() ?? "";
      }
    }

    // Resolve visibility
    const effective: Record<string, unknown> = { ...raw };
    const isVisible = new Map<string, boolean>();
    let currentSectionVisible = true;
    for (const field of fields) {
      const selfVisible = isFieldVisible(field, effective);
      if (field.type === "section") {
        currentSectionVisible = selfVisible;
      }
      const visible = selfVisible && currentSectionVisible;
      isVisible.set(field.name, visible);
      if (!visible && field.type !== "section") delete effective[field.name];
    }

    const collected: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.type === "section") continue;
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
      if (field.type === "select" && str) {
        if (field.allowOther && str === "__other__") {
          const otherValue = (formData.get(`${field.name}_other`) as string)?.trim();
          if (field.required && !otherValue) {
            return { error: `Please specify a value for "${field.label}".` };
          }
          collected[field.name] = otherValue;
        } else if (!field.options?.includes(str)) {
          return { error: `"${str}" is not a valid option for "${field.label}".` };
        } else {
          collected[field.name] = str;
        }
      } else {
        collected[field.name] = str;
      }
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
