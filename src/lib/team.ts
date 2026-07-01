import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import type { TeamMember, Committee } from "@/types";

export type TeamData = {
  officers: TeamMember[];
  seniorExecs: TeamMember[];
  committees: Committee[];
};

export type TeamMemberRecord = typeof teamMembers.$inferSelect;

export const TEAM_SECTIONS = ["officers", "seniorExecs", "committee"] as const;
export type TeamSection = (typeof TEAM_SECTIONS)[number];

function toMember(row: TeamMemberRecord): TeamMember {
  return {
    id: String(row.id),
    name: row.name,
    role: row.role,
    imageUrl: row.imageUrl ?? undefined,
    linkedin: row.linkedin ?? undefined,
    imagePosition: row.imagePosition ?? undefined,
    imageScale: row.imageScale ?? undefined,
    imageOffset: row.imageOffset ?? undefined,
  };
}

/** Reconstructs the year → { officers, seniorExecs, committees } structure. */
export async function getTeamData(): Promise<Record<string, TeamData>> {
  const rows = await db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.year), asc(teamMembers.sortOrder));

  const byYear: Record<string, TeamData> = {};

  for (const row of rows) {
    const year = (byYear[row.year] ??= {
      officers: [],
      seniorExecs: [],
      committees: [],
    });
    const member = toMember(row);

    if (row.section === "officers") {
      year.officers.push(member);
    } else if (row.section === "seniorExecs") {
      year.seniorExecs.push(member);
    } else {
      const title = row.committeeTitle?.trim() || "Committee";
      let committee = year.committees.find((c) => c.title === title);
      if (!committee) {
        committee = { title, members: [] };
        year.committees.push(committee);
      }
      committee.members.push(member);
    }
  }

  return byYear;
}

/** Flat list for the admin table, ordered for display. */
export async function getAllTeamMembers(): Promise<TeamMemberRecord[]> {
  return db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.year), asc(teamMembers.sortOrder));
}

export async function getTeamMemberById(
  id: number
): Promise<TeamMemberRecord | null> {
  const [member] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, id));
  return member ?? null;
}
