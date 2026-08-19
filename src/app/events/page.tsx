export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import { getAllEvents } from "@/lib/events";
import EventList from "@/components/event-list";
import { IeeeEvent, EventCategory } from "@/types";

export const metadata: Metadata = {
    title: "Events",
    description:
        "Discover upcoming and past workshops, seminars, hackathons, and networking events from IEEE Pulchowk Student Branch.",
    openGraph: {
        title: "Events | IEEE Pulchowk Student Branch",
        description:
            "Discover upcoming and past workshops, seminars, hackathons, and networking events from IEEE Pulchowk Student Branch.",
    },
};

export default async function EventsPage() {
    const events = await getAllEvents();

    const formattedEvents: IeeeEvent[] = events.map((event) => ({
        id: event.slug,
        title: event.title,
        dates: event.dates,
        location: event.location,
        description: event.description,
        category: (event.category as EventCategory) || EventCategory.WORKSHOP,
        isUpcoming: event.isUpcoming,
        imageUrl: event.thumbnail,
        registrationUrl: event.registrationUrl || undefined,
    }));

    return <EventList events={formattedEvents} />;
}
