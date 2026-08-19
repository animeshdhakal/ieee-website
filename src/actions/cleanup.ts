"use server";

import { db } from "@/db";
import { forms, formSubmissions } from "@/db/schema";
import type { FormField } from "@/lib/form-fields";
import fs from "fs/promises";
import path from "path";

export async function cleanupDanglingFiles() {
  let deletedCount = 0;

  try {
    const referencedFiles = new Set<string>();

    const addReference = (val: string | null | undefined) => {
      if (val && typeof val === "string") {
        referencedFiles.add(val.split("/").pop()!);
      }
    };

    const allForms = await db.select({ fields: forms.fields }).from(forms);
    allForms.forEach((f) => {
      (f.fields || []).forEach((field: FormField) => {
        addReference(field.image);
      });
    });

    const allSubmissions = await db.select({ formData: formSubmissions.formData }).from(formSubmissions);
    allSubmissions.forEach((s) => {
      if (s.formData && typeof s.formData === "object") {
        Object.values(s.formData).forEach((val) => {
          if (typeof val === "string") {
            addReference(val);
          }
        });
      }
    });

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    try {
      const files = await fs.readdir(uploadsDir);
      for (const file of files) {
        if (!referencedFiles.has(file)) {
          await fs.unlink(path.join(uploadsDir, file));
          deletedCount++;
        }
      }
    } catch {
      // Directory may not exist yet
    }

    return { success: true, deletedCount };
  } catch (error) {
    console.error("Cleanup error:", error);
    return { error: "Failed to clean up files." };
  }
}
