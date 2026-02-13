import React from "react";
import HomeHero from "@/components/HomeHero";
import HomeAbout from "@/components/HomeAbout";
import HomeEvents from "@/components/HomeEvents";
import HomeCTA from "@/components/HomeCTA";
import { getAllEvents } from "@/lib/events";
import { IeeeEvent, EventCategory } from "@/types";

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
