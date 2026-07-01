import { db } from "@/db";
import { forms, formSubmissions } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import type { FormField } from "@/lib/form-fields";

export type FormRecord = typeof forms.$inferSelect;

export async function getFormSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: forms.slug }).from(forms);
  return rows.map((row) => row.slug);
}

export async function getFormBySlug(slug: string): Promise<FormRecord | null> {
  const [form] = await db.select().from(forms).where(eq(forms.slug, slug)).limit(1);
  return form ?? null;
}

/** All forms, newest first, each annotated with its submission count. */
export async function getAllFormsWithCounts() {
  const allForms = await db.select().from(forms).orderBy(desc(forms.createdAt));

  const counts = await db
    .select({
      formId: formSubmissions.formId,
      count: sql<number>`count(*)`,
    })
    .from(formSubmissions)
    .groupBy(formSubmissions.formId);

  const countMap = counts.reduce<Record<string, number>>((acc, row) => {
    acc[row.formId] = Number(row.count);
    return acc;
  }, {});

  return allForms.map((form) => ({
    ...form,
    fields: (form.fields ?? []) as FormField[],
    submissionCount: countMap[form.slug] ?? 0,
  }));
}
