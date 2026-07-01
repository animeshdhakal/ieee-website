import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { GalleryItem } from "@/types";

export type GalleryRecord = typeof galleryItems.$inferSelect;

/** Public-facing gallery items, newest first. */
export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const rows = await db
    .select()
    .from(galleryItems)
    .orderBy(desc(galleryItems.createdAt));

  return rows.map((row) => ({
    id: String(row.id),
    title: row.title,
    category: row.category,
    date: row.date,
    imageUrl: row.imageUrl,
  }));
}
