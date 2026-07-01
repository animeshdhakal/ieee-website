"use client";

import { useState } from "react";
import { Trash2, LoaderCircle } from "lucide-react";
import { deleteTeamMember } from "@/actions/team";

export function DeleteTeamButton({ id, name }: { id: number; name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <form
      action={deleteTeamMember}
      onSubmit={(e) => {
        if (!window.confirm(`Remove ${name} from the team? This can't be undone.`)) {
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
        title="Remove member"
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
