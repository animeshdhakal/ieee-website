"use client";

import { useRef, useState } from "react";
import { Upload, LoaderCircle, X } from "lucide-react";
import { uploadImage } from "@/utils/uploadImage";

type Props = {
  /** When set, the value is submitted with the form via a hidden input. */
  name?: string;
  defaultValue?: string | null;
  label?: string;
  bucket?: string;
  /** Called whenever the URL changes (upload, manual edit, or remove). */
  onChange?: (url: string) => void;
};

export function ImageUploadField({ name, defaultValue, label = "Thumbnail", bucket, onChange }: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateUrl(next: string) {
    setUrl(next);
    onChange?.(next);
  }

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    setIsUploading(true);
    try {
      const uploaded = await uploadImage(file, bucket);
      updateUrl(uploaded);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>

      {/* The value submitted with the form */}
      {name && <input type="hidden" name={name} value={url} />}

      <div className="flex items-start gap-4">
        <div className="w-28 h-20 shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-ieee-blue transition-colors disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} /> Upload
                </>
              )}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => updateUrl("")}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                <X size={16} /> Remove
              </button>
            )}
          </div>

          <input
            type="text"
            value={url}
            onChange={(e) => updateUrl(e.target.value)}
            placeholder="…or paste an image URL / path"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue/30 focus:border-ieee-blue transition-all"
          />
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
