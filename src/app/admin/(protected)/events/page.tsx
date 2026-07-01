export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { Plus, Pencil, Calendar, MapPin, ExternalLink } from "lucide-react";
import { getAllEvents } from "@/lib/events";
import { DeleteEventButton } from "@/components/admin/DeleteEventButton";

export const metadata = {
  title: "Manage Events | Admin",
};

export default async function ManageEventsPage() {
  const events = await getAllEvents();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-gray-500 mt-1">
            Create, edit, and delete events. {events.length} total.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center justify-center gap-2 bg-ieee-blue text-white font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> New Event
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {events.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-500">
            No events yet.{" "}
            <Link href="/admin/events/new" className="text-ieee-blue font-bold hover:underline">
              Create your first event
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {events.map((event: any) => (
              <li
                key={event.slug}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 truncate">{event.title}</h3>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${event.isUpcoming ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {event.isUpcoming ? "Upcoming" : "Past"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {event.date}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {event.location}
                      </span>
                    )}
                    {event.category && (
                      <span className="text-gray-400">{event.category}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/events/${event.slug}`}
                    target="_blank"
                    title="View public page"
                    className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-ieee-blue hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ExternalLink size={18} />
                  </Link>
                  <Link
                    href={`/admin/events/${event.slug}/edit`}
                    title="Edit event"
                    className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-ieee-blue hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </Link>
                  <DeleteEventButton slug={event.slug} title={event.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
