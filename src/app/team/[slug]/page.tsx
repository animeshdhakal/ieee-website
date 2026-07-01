export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Linkedin, Github, Instagram, Calendar } from "lucide-react";
import { getTeamMemberHistory, type TeamMemberRecord } from "@/lib/team";

const SECTION_LABELS: Record<string, string> = {
  officers: "Executive Officer",
  seniorExecs: "Senior Executive",
  committee: "Committee Member",
};

function groupLabel(member: TeamMemberRecord): string {
  if (member.section === "committee") {
    return member.committeeTitle?.trim() || "Committee";
  }
  return SECTION_LABELS[member.section] ?? member.section;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [member] = await getTeamMemberHistory(slug);
  if (!member) return { title: "Team Member" };
  return {
    title: `${member.name} — ${member.role}`,
    description: `${member.name}, ${member.role} at IEEE Pulchowk Student Branch.`,
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const history = await getTeamMemberHistory(slug);
  if (history.length === 0) notFound();

  // Newest record drives the header; prefer one that actually has a photo.
  const member = history.find((m) => m.imageUrl) ?? history[0];
  const linkedin = history.find((m) => m.linkedin)?.linkedin ?? null;
  const github = history.find((m) => m.github)?.github ?? null;
  const instagram = history.find((m) => m.instagram)?.instagram ?? null;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-ieee-blue transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Team
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-5">
          {/* Photo */}
          <div className="md:col-span-2 relative h-72 md:h-full min-h-[18rem] bg-gray-50 overflow-hidden flex items-center justify-center">
            {member.imageUrl ? (
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-contain"
                style={{
                  transform: `scale(${member.imageScale || 1}) translateY(${member.imageOffset || 0}px)`,
                  transformOrigin: member.imagePosition || "center",
                }}
              />
            ) : (
              <span className="text-gray-300 text-sm">No photo</span>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-3 p-8 md:p-10 flex flex-col">
            <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-ieee-blue/10 text-ieee-blue text-xs font-bold uppercase tracking-wide mb-4">
              {groupLabel(member)}
            </span>

            <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
            <p className="text-lg text-ieee-blue/90 font-medium mt-1">
              {member.role}
            </p>

            {/* Every committee/year this person has served in */}
            <div className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                {history.length > 1 ? "Roles & Committees" : "Role"}
              </h2>
              <ul className="space-y-3">
                {history.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <Calendar size={18} className="text-ieee-blue mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{entry.role}</p>
                      <p className="text-sm text-gray-500">
                        {groupLabel(entry)} · Committee {entry.year}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {(linkedin || github || instagram) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ieee-blue text-white font-bold hover:bg-ieee-dark transition-colors"
                  >
                    <Linkedin size={18} /> LinkedIn
                  </a>
                )}
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on GitHub`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-700 transition-colors"
                  >
                    <Github size={18} /> GitHub
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on Instagram`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition-opacity"
                  >
                    <Instagram size={18} /> Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
