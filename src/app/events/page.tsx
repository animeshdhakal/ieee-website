import React from "react";
import { getAllEvents } from "@/lib/events";
import EventList from "@/components/event-list";
import { IeeeEvent, EventCategory } from "@/types";

export default function EventsPage() {
    const events = getAllEvents([
        "slug",
        "title",
        "date",
        "location",
        "description",
        "category",
        "isUpcoming",
        "thumbnail",
        "registrationUrl",
    ]);

    const formattedEvents: IeeeEvent[] = events.map((event) => ({
        id: event.slug as string,
        title: event.title as string,
        date: event.date as string,
        location: event.location as string,
        description: event.description as string,
        category: event.category as EventCategory,
        isUpcoming: event.isUpcoming as unknown as boolean, // gray-matter returns boolean
        imageUrl: event.thumbnail as string,
        registrationUrl: event.registrationUrl as string | undefined,
    }));

    return <EventList events={formattedEvents} />;
}
