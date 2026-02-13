import React from "react";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { IeeeEvent } from "@/types";

interface EventCardProps {
  event: IeeeEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
      {/* Image area */}
      <div className="h-48 bg-gray-100 relative overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="absolute inset-0 bg-ieee-blue/5 group-hover:bg-ieee-blue/10 transition-colors duration-300" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-ieee-dark uppercase tracking-wide">
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1.5" />
            {event.date}
          </div>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1.5" />
            <span className="truncate max-w-[120px]">{event.location}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-ieee-blue transition-colors duration-200">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {event.description}
        </p>

        <div className="mt-auto">
          <button className="inline-flex items-center text-sm font-semibold text-ieee-blue hover:text-ieee-dark transition-colors group-hover:translate-x-1 duration-300">
            {event.isUpcoming ? "Register Now" : "View Details"}{" "}
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
