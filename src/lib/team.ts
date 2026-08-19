import { TEAM_DATA, TeamData } from "@/constants";

export type { TeamData };

export interface TeamMemberRecord {
  id: string;
  year: string;
  section: "officers" | "seniorExecs" | "committee";
  committeeTitle?: string;
  name: string;
  role: string;
  imageUrl?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  imagePosition?: string;
  imageScale?: number;
  imageOffset?: number;
}

export async function getTeamData(): Promise<Record<string, TeamData>> {
  return TEAM_DATA;
}

export function teamMemberSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getAllTeamMembers(): Promise<TeamMemberRecord[]> {
  const members: TeamMemberRecord[] = [];
  for (const [year, data] of Object.entries(TEAM_DATA)) {
    for (const m of data.officers) {
      members.push({
        id: m.id,
        year,
        section: "officers",
        name: m.name,
        role: m.role,
        imageUrl: m.imageUrl,
        linkedin: m.linkedin,
        github: m.github,
        instagram: m.instagram,
        imagePosition: m.imagePosition,
        imageScale: m.imageScale,
        imageOffset: m.imageOffset,
      });
    }
    for (const m of data.seniorExecs) {
      members.push({
        id: m.id,
        year,
        section: "seniorExecs",
        name: m.name,
        role: m.role,
        imageUrl: m.imageUrl,
        linkedin: m.linkedin,
        github: m.github,
        instagram: m.instagram,
        imagePosition: m.imagePosition,
        imageScale: m.imageScale,
        imageOffset: m.imageOffset,
      });
    }
    for (const c of data.committees) {
      for (const m of c.members) {
        members.push({
          id: m.id,
          year,
          section: "committee",
          committeeTitle: c.title,
          name: m.name,
          role: m.role,
          imageUrl: m.imageUrl,
          linkedin: m.linkedin,
          github: m.github,
          instagram: m.instagram,
          imagePosition: m.imagePosition,
          imageScale: m.imageScale,
          imageOffset: m.imageOffset,
        });
      }
    }
  }
  return members;
}

export async function getTeamMemberById(id: number | string): Promise<TeamMemberRecord | null> {
  const members = await getAllTeamMembers();
  return members.find((m) => String(m.id) === String(id)) ?? null;
}

export async function getTeamMemberHistory(slug: string): Promise<TeamMemberRecord[]> {
  const history: TeamMemberRecord[] = [];

  for (const [year, data] of Object.entries(TEAM_DATA)) {
    for (const m of data.officers) {
      if (teamMemberSlug(m.name) === slug) {
        history.push({
          id: m.id,
          year,
          section: "officers",
          name: m.name,
          role: m.role,
          imageUrl: m.imageUrl,
          linkedin: m.linkedin,
          github: m.github,
          instagram: m.instagram,
          imagePosition: m.imagePosition,
          imageScale: m.imageScale,
          imageOffset: m.imageOffset,
        });
      }
    }
    for (const m of data.seniorExecs) {
      if (teamMemberSlug(m.name) === slug) {
        history.push({
          id: m.id,
          year,
          section: "seniorExecs",
          name: m.name,
          role: m.role,
          imageUrl: m.imageUrl,
          linkedin: m.linkedin,
          github: m.github,
          instagram: m.instagram,
          imagePosition: m.imagePosition,
          imageScale: m.imageScale,
          imageOffset: m.imageOffset,
        });
      }
    }
    for (const c of data.committees) {
      for (const m of c.members) {
        if (teamMemberSlug(m.name) === slug) {
          history.push({
            id: m.id,
            year,
            section: "committee",
            committeeTitle: c.title,
            name: m.name,
            role: m.role,
            imageUrl: m.imageUrl,
            linkedin: m.linkedin,
            github: m.github,
            instagram: m.instagram,
            imagePosition: m.imagePosition,
            imageScale: m.imageScale,
            imageOffset: m.imageOffset,
          });
        }
      }
    }
  }

  return history;
}
