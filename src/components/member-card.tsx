import React from "react";
import { Linkedin, User } from "lucide-react";
import { TeamMember } from "../types";
import Image from "next/image";

interface MemberCardProps {
  member: TeamMember;
  compact?: boolean; // For executive members list if needed to be smaller
}

const MemberCard: React.FC<MemberCardProps> = ({ member, compact = false }) => {
  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-ieee-blue/30 transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* Image / Placeholder */}
      <div className="relative w-full h-64 sm:h-72 bg-gray-50 overflow-hidden flex items-center justify-center">
        {member.imageUrl ? (
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-contain"
              style={{
                transform: `scale(${member.imageScale || 1}) translateY(${member.imageOffset || 0}px)`,
                transformOrigin: member.imagePosition || "center",
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <User className="text-gray-300 w-12 h-12" />
        )}
      </div>

      <div className="p-5 flex flex-col items-center text-center flex-grow">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-ieee-blue transition-colors duration-200">
          {member.name}
        </h3>
        <p className="text-ieee-blue/80 text-sm font-medium mt-1 mb-3">
          {member.role}
        </p>

        {/* Social Link - Only show if hovering or on mobile */}
        <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
          <a
            href={member.linkedin || "#"}
            className="inline-flex items-center text-gray-400 hover:text-blue-700 transition-colors"
            aria-label={`LinkedIn profile of ${member.name}`}
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
