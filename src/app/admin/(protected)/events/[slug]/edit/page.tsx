import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { EventForm } from "@/components/admin/EventForm";
import { updateEvent } from "@/actions/events";
import { getEventBySlug } from "@/lib/events";

export const metadata = {
  title: "Edit Event | Admin",
};

/** Convert a stored display date ("June 6, 2026") to a yyyy-MM-dd input value. */
function toDateInput(value: unknown): string {
  if (typeof value !== "string") return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return format(parsed, "yyyy-MM-dd");
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/admin/events"
          className="text-sm font-medium text-gray-500 hover:text-ieee-blue flex items-center mb-2"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Events
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
      </div>

      <EventForm
        action={updateEvent}
        mode="edit"
        defaults={{
          slug: event.slug,
          title: event.title,
          date: toDateInput(event.date),
          category: event.category ?? "",
          location: event.location,
          description: event.description,
          thumbnail: event.thumbnail,
          registrationUrl: event.registrationUrl,
          content: event.content,
          isUpcoming: event.isUpcoming ?? false,
        }}
      />
    </div>
  );
}
