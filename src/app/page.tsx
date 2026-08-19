export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import HomeHero from "@/components/home-hero";
import HomeAbout from "@/components/home-about";
import HomeEvents from "@/components/home-events";
import HomeCTA from "@/components/home-cta";
import { getAllEvents } from "@/lib/events";
import { IeeeEvent, EventCategory } from "@/types";

export const metadata: Metadata = {
    title: "IEEE Pulchowk Student Branch | Advancing Technology for Humanity",
    description:
        "Official website of IEEE Pulchowk Student Branch at IOE Pulchowk Campus. Join workshops, seminars, hackathons, and connect with a community of tech enthusiasts in Nepal.",
    openGraph: {
        title: "IEEE Pulchowk Student Branch | Advancing Technology for Humanity",
        description:
            "Join workshops, seminars, hackathons, and connect with a community of tech enthusiasts at IOE Pulchowk Campus, Nepal.",
    },
};

export default async function Home() {
    const events = await getAllEvents();

    const formattedEvents: IeeeEvent[] = events
        .map((event) => ({
            id: event.slug,
            title: event.title,
            dates: event.dates,
            location: event.location,
            description: event.description,
            category: (event.category as EventCategory) || EventCategory.WORKSHOP,
            isUpcoming: event.isUpcoming,
            imageUrl: event.thumbnail,
            registrationUrl: event.registrationUrl || undefined,
        }))
        .filter((e) => e.isUpcoming)
        .slice(0, 3);

    return (
        <div className="flex flex-col min-h-screen">
            <HomeHero />
            <HomeAbout />
            <HomeEvents events={formattedEvents} />
            <HomeCTA />
        </div>
    );
}
