import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { createEvent } from "@/actions/events";

export const metadata = {
  title: "New Event | Admin",
};

export default function NewEventPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/admin/events"
          className="text-sm font-medium text-gray-500 hover:text-ieee-blue flex items-center mb-2"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Events
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Event</h1>
      </div>

      <EventForm action={createEvent} mode="create" />
    </div>
  );
}
