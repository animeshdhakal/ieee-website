"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import { IeeeEvent } from "@/types";

interface HomeEventsProps {
  events: IeeeEvent[];
}

const HomeEvents: React.FC<HomeEventsProps> = ({ events }) => {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-ieee-blue font-semibold text-sm uppercase tracking-wider mb-2 block">
              Mark Your Calendars
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              Upcoming Events
            </h2>
          </div>
          <Link
            href="/events"
            className="hidden sm:inline-flex items-center text-gray-600 hover:text-ieee-blue transition-colors font-medium"
          >
            View All <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full"
              >
                <EventCard event={event} />
              </motion.div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500 py-10">
              No upcoming events scheduled at the moment.
            </p>
          )}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/events"
            className="inline-flex items-center text-ieee-blue font-medium"
          >
            View All Events <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeEvents;
