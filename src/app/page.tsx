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

export default function Home() {
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

    const formattedEvents: IeeeEvent[] = events
        .map((event) => ({
            id: event.slug as string,
            title: event.title as string,
            date: event.date as string,
            location: event.location as string,
            description: event.description as string,
            category: event.category as EventCategory,
            isUpcoming: event.isUpcoming as unknown as boolean, // gray-matter returns boolean
            imageUrl: event.thumbnail as string,
            registrationUrl: event.registrationUrl as string | undefined,
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
