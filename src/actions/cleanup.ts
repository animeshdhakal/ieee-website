"use server";

import { db } from "@/db";
import { events, blogs, teamMembers, galleryItems, forms, formSubmissions } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { EVENT_IMAGE_BUCKET, TEAM_IMAGE_BUCKET, FORM_UPLOAD_BUCKET } from "@/utils/uploadImage";

export async function cleanupDanglingFiles() {
  const supabase = await createClient();
  const buckets = [EVENT_IMAGE_BUCKET, TEAM_IMAGE_BUCKET, FORM_UPLOAD_BUCKET];
  let deletedCount = 0;

  try {
    // Gather all referenced files
    const referencedFiles = new Set<string>();

    // Helper to safely extract filename from a full URL or a raw filename string
    const addReference = (val: string | null | undefined) => {
      if (val && typeof val === "string") {
        referencedFiles.add(val.split("/").pop()!);
      }
    };

    const allEvents = await db.select({ thumbnail: events.thumbnail }).from(events);
    allEvents.forEach((e) => addReference(e.thumbnail));

    const allBlogs = await db.select({ thumbnail: blogs.thumbnail }).from(blogs);
    allBlogs.forEach((b) => addReference(b.thumbnail));

    const allTeam = await db.select({ imageUrl: teamMembers.imageUrl }).from(teamMembers);
    allTeam.forEach((t) => addReference(t.imageUrl));

    const allGallery = await db.select({ imageUrl: galleryItems.imageUrl }).from(galleryItems);
    allGallery.forEach((g) => addReference(g.imageUrl));

    const allForms = await db.select({ fields: forms.fields }).from(forms);
    allForms.forEach((f) => {
      (f.fields || []).forEach((field: any) => {
        addReference(field.image);
      });
    });

    const allSubmissions = await db.select({ formData: formSubmissions.formData }).from(formSubmissions);
    allSubmissions.forEach((s) => {
      if (s.formData) {
        Object.values(s.formData).forEach((val) => {
          addReference(val as string);
        });
      }
    });

    // Iterate through buckets
    for (const bucket of buckets) {
      // Note: for very large buckets, pagination with `limit` and `offset` would be required.
      const { data: files, error } = await supabase.storage.from(bucket).list();

      if (error || !files) {
        console.error(`Error fetching files for bucket ${bucket}:`, error);
        continue;
      }

      const toDelete = files
        .filter((f) => f.name !== ".emptyFolderPlaceholder") // Ignore placeholder
        .filter((f) => !referencedFiles.has(f.name))
        .map((f) => f.name);

      if (toDelete.length > 0) {
        const { error: deleteError } = await supabase.storage.from(bucket).remove(toDelete);
        if (!deleteError) {
          deletedCount += toDelete.length;
        } else {
          console.error(`Error deleting files in bucket ${bucket}:`, deleteError);
        }
      }
    }

    return { success: true, deletedCount };
  } catch (error) {
    console.error("Cleanup error:", error);
    return { error: "Failed to clean up files." };
  }
}
