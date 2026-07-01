import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { slugify } from "./form-fields";
import type { TeamMember, Committee } from "@/types";

/** URL slug for a member, derived from their name (e.g. "animesh-dhakal"). */
export function teamMemberSlug(name: string): string {
  return slugify(name);
}

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
    github: row.github ?? undefined,
    instagram: row.instagram ?? undefined,
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

  // A person may have a photo on one year's record but not another. Build a
  // per-person fallback (by name slug) so their picture shows in every year.
  const photoBySlug = new Map<
    string,
    Pick<TeamMemberRecord, "imageUrl" | "imageScale" | "imageOffset" | "imagePosition">
  >();
  for (const row of rows) {
    if (row.imageUrl) photoBySlug.set(slugify(row.name), row);
  }

  const byYear: Record<string, TeamData> = {};

  for (const row of rows) {
    const year = (byYear[row.year] ??= {
      officers: [],
      seniorExecs: [],
      committees: [],
    });
    const member = toMember(row);

    if (!member.imageUrl) {
      const fallback = photoBySlug.get(slugify(row.name));
      if (fallback) {
        member.imageUrl = fallback.imageUrl ?? undefined;
        member.imageScale = fallback.imageScale ?? undefined;
        member.imageOffset = fallback.imageOffset ?? undefined;
        member.imagePosition = fallback.imagePosition ?? undefined;
      }
    }

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

/**
 * Looks up a member by name-derived slug. If a name repeats across committee
 * years, the most recent year's record wins.
 */
export async function getTeamMemberBySlug(
  slug: string
): Promise<TeamMemberRecord | null> {
  const rows = await db
    .select()
    .from(teamMembers)
    .orderBy(desc(teamMembers.year));
  return rows.find((member) => slugify(member.name) === slug) ?? null;
}

/**
 * All records for a person (matched by name slug), newest year first. A person
 * who served on several committees/years has one entry per position.
 */
export async function getTeamMemberHistory(
  slug: string
): Promise<TeamMemberRecord[]> {
  const rows = await db
    .select()
    .from(teamMembers)
    .orderBy(desc(teamMembers.year), asc(teamMembers.sortOrder));
  return rows.filter((member) => slugify(member.name) === slug);
}
