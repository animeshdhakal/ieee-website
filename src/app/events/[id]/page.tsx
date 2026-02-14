import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, ArrowRight } from "lucide-react";
import { getEventBySlug, getAllEvents } from "@/lib/events";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const events = getAllEvents(["slug"]);
  return events.map((event) => ({
    id: event.slug,
  }));
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventData = getEventBySlug(id, [
    "title",
    "date",
    "slug",
    "location",
    "category",
    "isUpcoming",
    "description",
    "thumbnail",
    "registrationUrl",
    "content",
  ]);

  if (!eventData.slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <Link href="/events" className="text-ieee-blue hover:underline">
            Return to Events
          </Link>
        </div>
      </div>
    );
  }

  const allEvents = getAllEvents([
    "slug",
    "title",
    "category",
    "date",
    "description",
  ]);
  const relatedEvents = allEvents.filter((e) => e.slug !== id).slice(0, 2);

  return (
    <article className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <Link
          href="/events"
          className="inline-flex items-center text-gray-500 hover:text-ieee-blue transition-colors mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to Events
        </Link>

        <div className="flex items-center space-x-2 mb-6">
          <span className="bg-blue-50 text-ieee-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            {eventData.category}
          </span>
          {eventData.isUpcoming && (
            <>
              <span className="text-gray-400 text-sm">&bull;</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Upcoming
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
          {eventData.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-8">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-ieee-blue" />
              {eventData.date}
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-ieee-blue" />
              {eventData.location}
            </div>
          </div>

          {eventData.isUpcoming && eventData.registrationUrl && (
            <a
              href={eventData.registrationUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-2.5 bg-ieee-blue text-white rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
            >
              Register Now <ArrowRight size={16} className="ml-2" />
            </a>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {eventData.thumbnail && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
            <img
              src={eventData.thumbnail as string}
              alt={eventData.title as string}
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
          <ReactMarkdown>{eventData.content as string}</ReactMarkdown>
        </div>

        {relatedEvents.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              More Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedEvents.map((related) => (
                <Link
                  key={related.slug as string}
                  href={`/events/${related.slug}`}
                  className="group block bg-gray-50 p-6 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                    {related.category}
                  </span>
                  <h4 className="font-bold text-gray-900 group-hover:text-ieee-blue transition-colors mb-2">
                    {related.title}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
