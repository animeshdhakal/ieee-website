"use client";

import { useState } from "react";
import { Trash2, LoaderCircle } from "lucide-react";
import { deleteGalleryItem } from "@/actions/gallery";

export function DeleteGalleryButton({ id, title }: { id: number; title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <form
      action={deleteGalleryItem}
      onSubmit={(e) => {
        if (!window.confirm(`Remove "${title}" from the gallery? This can't be undone.`)) {
          e.preventDefault();
          return;
        }
        setIsDeleting(true);
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isDeleting}
        title="Delete image"
        className="inline-flex items-center justify-center p-2 bg-white/90 text-gray-500 hover:text-red-600 rounded-lg shadow-sm transition-colors disabled:opacity-50"
      >
        {isDeleting ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <Trash2 size={16} />
        )}
      </button>
    </form>
  );
}
