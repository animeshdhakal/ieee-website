import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getEventSlugs() {
  const result = await db.select({ slug: events.slug }).from(events);
  return result.map(row => row.slug);
}

export async function getEventBySlug(slug: string, fields: string[] = []) {
  const [event] = await db.select().from(events).where(eq(events.slug, slug));
  
  if (!event) return null;

  type Items = Record<string, any>;

  const items: Items = {};

  // If no fields specified, return everything (or for backward compatibility, just the requested fields)
  if (fields.length === 0) {
    return event;
  }

  // Ensure minimal required fields
  items["slug"] = event.slug;
  items["content"] = event.content;

  fields.forEach((field) => {
    if (field in event) {
      items[field] = event[field as keyof typeof event];
    }
  });

  return items;
}

/**
 * Sort key for an event date. Dates are free-form strings like "June 6, 2026".
 * Unparseable values (e.g. "Coming soon", "TBD") sort to the very top, since
 * those are undated/upcoming events.
 */
function eventTime(date: unknown): number {
  const t = new Date(date as string).getTime();
  return Number.isNaN(t) ? Infinity : t;
}

export async function getAllEvents(fields: string[] = []) {
  const allEvents = await db.select().from(events);

  // Latest first; undated ("Coming soon") events float to the top.
  const sortedEvents = [...allEvents].sort((event1, event2) => {
    const d1 = event1.dates && event1.dates.length > 0 ? event1.dates[0] : "";
    const d2 = event2.dates && event2.dates.length > 0 ? event2.dates[0] : "";
    const t1 = eventTime(d1);
    const t2 = eventTime(d2);
    if (t1 === t2) return 0;
    return t1 > t2 ? -1 : 1;
  });

  return sortedEvents.map(event => {
    const items: Record<string, any> = {};
    if (fields.length === 0) return event;
    
    fields.forEach((field) => {
      if (field in event) {
        items[field] = event[field as keyof typeof event];
      }
    });
    // Ensure minimal required fields for compatibility
    items["slug"] = event.slug;
    return items;
  });
}
