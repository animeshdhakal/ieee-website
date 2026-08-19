import { GALLERY_ITEMS } from "@/constants";
import type { GalleryItem } from "@/types";

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  return GALLERY_ITEMS;
}
