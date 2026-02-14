"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { IeeeEvent, EventCategory } from "@/types";
import EventCard from "@/components/event-card";
import { Filter } from "lucide-react";

interface EventListProps {
    events: IeeeEvent[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
    const [filter, setFilter] = useState<EventCategory | "All">("All");
    const [view, setView] = useState<"upcoming" | "past">("upcoming");

    const filteredEvents = events.filter((event) => {
        const matchesCategory = filter === "All" || event.category === filter;
        const matchesView =
            view === "upcoming" ? event.isUpcoming : !event.isUpcoming;
        return matchesCategory && matchesView;
    });

    const categories = ["All", ...Object.values(EventCategory)];

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Events & Activities
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover workshops, seminars, and networking sessions
                        designed to boost your technical skills and professional
                        growth.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    {/* View Toggle */}
                    <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-flex">
                        <button
                            onClick={() => setView("upcoming")}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                view === "upcoming"
                                    ? "bg-ieee-blue text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setView("past")}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                view === "past"
                                    ? "bg-ieee-blue text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Past Events
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-2 md:pb-0 no-scrollbar">
                        <Filter
                            size={18}
                            className="text-gray-400 mr-2 flex-shrink-0"
                        />
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat as any)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                                    filter === cat
                                        ? "bg-ieee-dark text-white border-ieee-dark"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <motion.div
                                key={event.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <EventCard event={event} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500 text-lg">
                                No events found in this category.
                            </p>
                            <button
                                onClick={() => setFilter("All")}
                                className="mt-4 text-ieee-blue font-medium hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventList;
