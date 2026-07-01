"use server";

import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export type GalleryFormState = { error: string } | null;

function revalidateGallery() {
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function createGalleryItem(
  _prevState: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  await requireUser();

  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const date = (formData.get("date") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim();

  if (!title) return { error: "Title is required." };
  if (!category) return { error: "Category is required." };
  if (!date) return { error: "Year is required." };
  if (!imageUrl) return { error: "An image is required." };

  try {
    await db.insert(galleryItems).values({ title, category, date, imageUrl });
  } catch (error) {
    console.error("Failed to add gallery item:", error);
    return { error: "Failed to add gallery item. Please try again." };
  }

  revalidateGallery();
  redirect("/admin/gallery");
}

export async function deleteGalleryItem(formData: FormData) {
  await requireUser();

  const id = Number(formData.get("id"));
  if (!id) return;

  try {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  } catch (error) {
    console.error("Failed to delete gallery item:", error);
    return;
  }

  revalidateGallery();
}
