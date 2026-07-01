import { getAllGalleryItems } from "@/lib/gallery";
import { GalleryView } from "@/components/GalleryView";

export default async function GalleryPage() {
  const items = await getAllGalleryItems();
  return <GalleryView items={items} />;
}
