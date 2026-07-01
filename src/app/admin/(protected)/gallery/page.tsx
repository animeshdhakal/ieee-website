import { getAllGalleryItems } from "@/lib/gallery";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { DeleteGalleryButton } from "@/components/admin/DeleteGalleryButton";

export const metadata = {
  title: "Manage Gallery | Admin",
};

export default async function ManageGalleryPage() {
  const items = await getAllGalleryItems();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Gallery</h1>
        <p className="text-gray-500 mt-1">
          Upload images to the gallery. {items.length} total.
        </p>
      </div>

      <GalleryForm />

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-16 text-center text-gray-500">
          No gallery images yet. Add your first one above.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DeleteGalleryButton id={Number(item.id)} title={item.title} />
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.category} • {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
