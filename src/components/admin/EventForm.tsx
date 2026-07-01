"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LoaderCircle, Save } from "lucide-react";
import type { EventFormState } from "@/actions/events";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const CATEGORIES = ["Workshop", "Seminar", "Competition", "Social"];

export type EventDefaults = {
  slug?: string;
  title?: string;
  date?: string; // yyyy-MM-dd for the date input
  category?: string;
  location?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  registrationUrl?: string | null;
  content?: string;
  isUpcoming?: boolean;
};

type Props = {
  action: (
    prevState: EventFormState,
    formData: FormData
  ) => Promise<EventFormState>;
  mode: "create" | "edit";
  defaults?: EventDefaults;
};

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue/30 focus:border-ieee-blue transition-all";
const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

export function EventForm({ action, mode, defaults = {} }: Props) {
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
              placeholder="LaTeX Workshop 2026"
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
              placeholder="latex-workshop-2026"
            />
            <p className="text-xs text-gray-400 mt-1">
              {mode === "edit"
                ? "Slug can't be changed — it links registrations and the public URL."
                : "Used in the URL: /events/your-slug"}
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
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={defaults.category ?? ""}
              className={inputClass}
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={defaults.location ?? ""}
              className={inputClass}
              placeholder="IOE Pulchowk Campus"
            />
          </div>

          <div className="md:col-span-2">
            <ImageUploadField name="thumbnail" defaultValue={defaults.thumbnail} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="registrationUrl" className={labelClass}>
              External Registration URL
            </label>
            <input
              id="registrationUrl"
              name="registrationUrl"
              type="text"
              defaultValue={defaults.registrationUrl ?? ""}
              className={inputClass}
              placeholder="Leave empty to use the built-in registration form"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Short Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              defaultValue={defaults.description ?? ""}
              className={inputClass}
              placeholder="A one or two line summary shown on cards and previews."
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <input
            type="checkbox"
            name="isUpcoming"
            defaultChecked={defaults.isUpcoming ?? false}
            className="w-4 h-4 rounded border-gray-300 text-ieee-blue focus:ring-ieee-blue"
          />
          <span className="text-sm font-medium text-gray-700">
            Mark as an upcoming event
          </span>
        </label>
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
              <Save size={18} /> {mode === "create" ? "Create Event" : "Save Changes"}
            </>
          )}
        </button>
        <Link
          href="/admin/events"
          className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
