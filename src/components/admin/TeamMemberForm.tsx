"use client";

import { useActionState, useState } from "react";
import { LoaderCircle, Plus, Save } from "lucide-react";
import { createTeamMember, updateTeamMember } from "@/actions/team";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { TEAM_IMAGE_BUCKET } from "@/utils/uploadImage";
import type { TeamMemberRecord } from "@/lib/team";

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue/30 focus:border-ieee-blue transition-all";
const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

const SECTION_OPTIONS = [
  { value: "officers", label: "Executive Officer" },
  { value: "seniorExecs", label: "Senior Executive" },
  { value: "committee", label: "Committee Member" },
];

export function TeamMemberForm({ member }: { member?: TeamMemberRecord }) {
  const isEditing = Boolean(member);
  const [state, formAction, isPending] = useActionState(
    isEditing ? updateTeamMember : createTeamMember,
    null
  );
  const [section, setSection] = useState(member?.section ?? "officers");
  const [imageUrl, setImageUrl] = useState(member?.imageUrl ?? "");
  const [scale, setScale] = useState(member?.imageScale ?? 1);
  const [offset, setOffset] = useState(member?.imageOffset ?? 0);
  const [position, setPosition] = useState(member?.imagePosition ?? "center");

  return (
    <form action={formAction} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      {state?.error && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      {isEditing && <input type="hidden" name="id" value={member!.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-red-500">*</span>
          </label>
          <input id="name" name="name" type="text" required defaultValue={member?.name ?? ""} className={inputClass} placeholder="Manish Adhikari" />
        </div>

        <div>
          <label htmlFor="role" className={labelClass}>
            Role <span className="text-red-500">*</span>
          </label>
          <input id="role" name="role" type="text" required defaultValue={member?.role ?? ""} className={inputClass} placeholder="Chair" />
        </div>

        <div>
          <label htmlFor="year" className={labelClass}>
            Committee Year <span className="text-red-500">*</span>
          </label>
          <input id="year" name="year" type="text" required defaultValue={member?.year ?? ""} className={inputClass} placeholder="2026" />
        </div>

        <div>
          <label htmlFor="section" className={labelClass}>
            Section <span className="text-red-500">*</span>
          </label>
          <select
            id="section"
            name="section"
            required
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className={inputClass}
          >
            {SECTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {section === "committee" && (
          <div className="md:col-span-2">
            <label htmlFor="committeeTitle" className={labelClass}>
              Committee Title <span className="text-red-500">*</span>
            </label>
            <input
              id="committeeTitle"
              name="committeeTitle"
              type="text"
              defaultValue={member?.committeeTitle ?? ""}
              className={inputClass}
              placeholder="Technical Committee"
            />
          </div>
        )}

        <div className="md:col-span-2">
          <label htmlFor="linkedin" className={labelClass}>
            LinkedIn URL
          </label>
          <input
            id="linkedin"
            name="linkedin"
            type="text"
            defaultValue={member?.linkedin ?? ""}
            className={inputClass}
            placeholder="https://www.linkedin.com/in/…"
          />
        </div>

        <div className="md:col-span-2">
          <ImageUploadField
            name="imageUrl"
            label="Photo"
            bucket={TEAM_IMAGE_BUCKET}
            defaultValue={member?.imageUrl ?? undefined}
            onChange={setImageUrl}
          />
        </div>

        {/* Photo crop / positioning — stored per member, previewed live */}
        <div className="md:col-span-2">
          <label className={labelClass}>Photo positioning (crop)</label>
          <p className="text-xs text-gray-500 mb-3 -mt-1">
            Zoom and nudge the photo inside its card frame. Saved to the database
            per member.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="relative w-36 h-48 shrink-0 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="Crop preview"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    transform: `scale(${scale}) translateY(${offset}px)`,
                    transformOrigin: position || "center",
                  }}
                />
              ) : (
                <span className="text-xs text-gray-400">No image</span>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Zoom</span>
                  <span className="tabular-nums text-gray-500">
                    {scale.toFixed(2)}×
                  </span>
                </div>
                <input
                  type="range"
                  name="imageScale"
                  min={0.5}
                  max={3}
                  step={0.05}
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-ieee-blue"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">
                    Vertical offset
                  </span>
                  <span className="tabular-nums text-gray-500">{offset}px</span>
                </div>
                <input
                  type="range"
                  name="imageOffset"
                  min={-80}
                  max={80}
                  step={1}
                  value={offset}
                  onChange={(e) => setOffset(Number(e.target.value))}
                  className="w-full accent-ieee-blue"
                />
              </div>

              <div>
                <label
                  htmlFor="imagePosition"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Transform origin
                </label>
                <input
                  id="imagePosition"
                  name="imagePosition"
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="center (or e.g. 45% 50%)"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 bg-ieee-blue text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            {isEditing ? "Saving..." : "Adding..."}
          </>
        ) : isEditing ? (
          <>
            <Save size={18} /> Save Changes
          </>
        ) : (
          <>
            <Plus size={18} /> Add Member
          </>
        )}
      </button>
    </form>
  );
}
