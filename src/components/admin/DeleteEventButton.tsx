"use client";

import { useState } from "react";
import { Trash2, LoaderCircle } from "lucide-react";
import { deleteEvent } from "@/actions/events";

export function DeleteEventButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <form
      action={deleteEvent}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Delete "${title}"? This can't be undone. Registrations stay in the database but the event will be removed from the site.`
          )
        ) {
          e.preventDefault();
          return;
        }
        setIsDeleting(true);
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={isDeleting}
        title="Delete event"
        className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      >
        {isDeleting ? (
          <LoaderCircle size={18} className="animate-spin" />
        ) : (
          <Trash2 size={18} />
        )}
      </button>
    </form>
  );
}
