"use server";

import { db } from "@/db";
import { formSubmissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getFormSubmissions(formId: string) {
  const submissions = await db
    .select()
    .from(formSubmissions)
    .where(eq(formSubmissions.formId, formId))
    .orderBy(desc(formSubmissions.createdAt));
    
  return submissions;
}
