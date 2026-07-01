"use client";

import { useActionState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { createGalleryItem } from "@/actions/gallery";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue/30 focus:border-ieee-blue transition-all";
const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

export function GalleryForm() {
  const [state, formAction, isPending] = useActionState(createGalleryItem, null);

  return (
    <form action={formAction} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      {state?.error && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1">
          <label htmlFor="title" className={labelClass}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className={inputClass}
            placeholder="IEEE 2026 First Meetup"
          />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            name="category"
            type="text"
            required
            className={inputClass}
            placeholder="Meetup, Workshop, Event…"
          />
        </div>

        <div>
          <label htmlFor="date" className={labelClass}>
            Year <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            name="date"
            type="text"
            required
            className={inputClass}
            placeholder="2026"
          />
        </div>
      </div>

      <ImageUploadField name="imageUrl" label="Image" />

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 bg-ieee-blue text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <>
            <LoaderCircle size={18} className="animate-spin" /> Adding...
          </>
        ) : (
          <>
            <Plus size={18} /> Add to Gallery
          </>
        )}
      </button>
    </form>
  );
}
