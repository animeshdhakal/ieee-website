"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LoaderCircle, Save } from "lucide-react";
import type { BlogFormState } from "@/actions/blogs";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export type BlogDefaults = {
  slug?: string;
  title?: string;
  date?: string; // yyyy-MM-dd for the date input
  excerpt?: string | null;
  author?: string | null;
  authorRole?: string | null;
  category?: string | null;
  readTime?: string | null;
  thumbnail?: string | null;
  content?: string;
};

type Props = {
  action: (
    prevState: BlogFormState,
    formData: FormData
  ) => Promise<BlogFormState>;
  mode: "create" | "edit";
  defaults?: BlogDefaults;
};

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue/30 focus:border-ieee-blue transition-all";
const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

export function BlogForm({ action, mode, defaults = {} }: Props) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [slug, setSlug] = useState(defaults.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  function handleTitleChange(value: string) {
    if (mode === "create" && !slugTouched) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {mode === "edit" && (
        <input type="hidden" name="originalSlug" value={defaults.slug} />
      )}

      {state?.error && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="title" className={labelClass}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={defaults.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputClass}
              placeholder="Our Journey Building the IEEE Website"
            />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              readOnly={mode === "edit"}
              className={`${inputClass} ${mode === "edit" ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
              placeholder="ieee-website-launch"
            />
            <p className="text-xs text-gray-400 mt-1">
              {mode === "edit"
                ? "Slug can't be changed — it's the public URL."
                : "Used in the URL: /blogs/your-slug"}
            </p>
          </div>

          <div>
            <label htmlFor="date" className={labelClass}>
              Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={defaults.date}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              defaultValue={defaults.category ?? ""}
              className={inputClass}
              placeholder="Announcements, Tutorials, …"
            />
          </div>

          <div>
            <label htmlFor="author" className={labelClass}>
              Author
            </label>
            <input
              id="author"
              name="author"
              type="text"
              defaultValue={defaults.author ?? ""}
              className={inputClass}
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label htmlFor="authorRole" className={labelClass}>
              Author Role
            </label>
            <input
              id="authorRole"
              name="authorRole"
              type="text"
              defaultValue={defaults.authorRole ?? ""}
              className={inputClass}
              placeholder="Web Team Lead"
            />
          </div>

          <div>
            <label htmlFor="readTime" className={labelClass}>
              Read Time
            </label>
            <input
              id="readTime"
              name="readTime"
              type="text"
              defaultValue={defaults.readTime ?? ""}
              className={inputClass}
              placeholder="5 min read"
            />
          </div>

          <div className="md:col-span-2">
            <ImageUploadField name="thumbnail" defaultValue={defaults.thumbnail} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="excerpt" className={labelClass}>
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={defaults.excerpt ?? ""}
              className={inputClass}
              placeholder="A one or two line summary shown on cards and previews."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <label className={labelClass}>
          Content (Markdown) <span className="text-red-500">*</span>
        </label>
        <MarkdownEditor name="content" defaultValue={defaults.content} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-ieee-blue text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <>
              <LoaderCircle size={18} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={18} /> {mode === "create" ? "Create Blog" : "Save Changes"}
            </>
          )}
        </button>
        <Link
          href="/admin/blogs"
          className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
