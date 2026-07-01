export const dynamic = "force-dynamic";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { getAllTeamMembers, type TeamMemberRecord } from "@/lib/team";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { DeleteTeamButton } from "@/components/admin/DeleteTeamButton";
import { MoveTeamButtons } from "@/components/admin/MoveTeamButtons";

export const metadata = {
  title: "Manage Team | Admin",
};

const SECTION_LABELS: Record<string, string> = {
  officers: "Executive Officers",
  seniorExecs: "Senior Executives",
  committee: "Committee Members",
};

function groupLabel(member: TeamMemberRecord): string {
  if (member.section === "committee") {
    return member.committeeTitle?.trim() || "Committee";
  }
  return SECTION_LABELS[member.section] ?? member.section;
}

export default async function ManageTeamPage() {
  const members = await getAllTeamMembers();

  // Group by year, then by section/committee, preserving sortOrder.
  const byYear = new Map<string, Map<string, TeamMemberRecord[]>>();
  for (const member of members) {
    const groups = byYear.get(member.year) ?? new Map<string, TeamMemberRecord[]>();
    const label = groupLabel(member);
    const list = groups.get(label) ?? [];
    list.push(member);
    groups.set(label, list);
    byYear.set(member.year, groups);
  }

  const years = [...byYear.keys()].sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Team</h1>
        <p className="text-gray-500 mt-1">
          Add team members and organize them by committee year. {members.length} total.
        </p>
      </div>

      <TeamMemberForm />

      {members.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-16 text-center text-gray-500">
          No team members yet. Add your first one above.
        </div>
      ) : (
        years.map((year) => (
          <div key={year} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Committee {year}</h2>
            {[...byYear.get(year)!.entries()].map(([label, list]) => (
              <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4">{label}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {list.map((member) => (
                    <div
                      key={member.id}
                      className="group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50"
                    >
                      <div className="aspect-square bg-gray-100">
                        {member.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            No photo
                          </div>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/team/${member.id}/edit`}
                          title={`Edit ${member.name}`}
                          className="inline-flex items-center justify-center p-2 bg-white/90 text-gray-500 hover:text-ieee-blue rounded-lg shadow-sm transition-colors"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteTeamButton id={member.id} name={member.name} />
                      </div>
                      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoveTeamButtons id={member.id} />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-bold text-gray-900 truncate">{member.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
