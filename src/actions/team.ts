"use server";

import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { eq, sql, and, asc, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { TEAM_SECTIONS, type TeamSection } from "@/lib/team";

export type TeamFormState = { error: string } | null;

function revalidateTeam() {
  revalidatePath("/team");
  revalidatePath("/admin/team");
}

/** Parses an optional numeric form field, returning null when blank/invalid. */
function parseNum(value: FormDataEntryValue | null): number | null {
  const raw = (value as string)?.trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isNaN(n) ? null : n;
}

export async function createTeamMember(
  _prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await requireUser();

  const year = (formData.get("year") as string)?.trim();
  const section = (formData.get("section") as string)?.trim() as TeamSection;
  const committeeTitle = (formData.get("committeeTitle") as string)?.trim() || null;
  const name = (formData.get("name") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const linkedin = (formData.get("linkedin") as string)?.trim() || null;
  const github = (formData.get("github") as string)?.trim() || null;
  const instagram = (formData.get("instagram") as string)?.trim() || null;

  if (!year) return { error: "Year is required." };
  if (!TEAM_SECTIONS.includes(section)) return { error: "A valid section is required." };
  if (section === "committee" && !committeeTitle) {
    return { error: "Committee title is required for committee members." };
  }
  if (!name) return { error: "Name is required." };
  if (!role) return { error: "Role is required." };

  // Append new members at the end of their year's ordering.
  const [{ max }] = await db
    .select({ max: sql<number>`coalesce(max(${teamMembers.sortOrder}), 0)` })
    .from(teamMembers)
    .where(eq(teamMembers.year, year));

  try {
    await db.insert(teamMembers).values({
      year,
      section,
      committeeTitle: section === "committee" ? committeeTitle : null,
      name,
      role,
      imageUrl,
      linkedin,
      github,
      instagram,
      imageScale: parseNum(formData.get("imageScale")),
      imageOffset: parseNum(formData.get("imageOffset")),
      imagePosition: (formData.get("imagePosition") as string)?.trim() || null,
      sortOrder: Number(max) + 1,
    });
  } catch (error) {
    console.error("Failed to add team member:", error);
    return { error: "Failed to add team member. Please try again." };
  }

  revalidateTeam();
  redirect("/admin/team");
}

export async function updateTeamMember(
  _prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await requireUser();

  const id = Number(formData.get("id"));
  if (!id) return { error: "Invalid team member." };

  const year = (formData.get("year") as string)?.trim();
  const section = (formData.get("section") as string)?.trim() as TeamSection;
  const committeeTitle = (formData.get("committeeTitle") as string)?.trim() || null;
  const name = (formData.get("name") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const linkedin = (formData.get("linkedin") as string)?.trim() || null;
  const github = (formData.get("github") as string)?.trim() || null;
  const instagram = (formData.get("instagram") as string)?.trim() || null;

  if (!year) return { error: "Year is required." };
  if (!TEAM_SECTIONS.includes(section)) return { error: "A valid section is required." };
  if (section === "committee" && !committeeTitle) {
    return { error: "Committee title is required for committee members." };
  }
  if (!name) return { error: "Name is required." };
  if (!role) return { error: "Role is required." };

  try {
    await db
      .update(teamMembers)
      .set({
        year,
        section,
        committeeTitle: section === "committee" ? committeeTitle : null,
        name,
        role,
        imageUrl,
        linkedin,
      github,
      instagram,
        imageScale: parseNum(formData.get("imageScale")),
        imageOffset: parseNum(formData.get("imageOffset")),
        imagePosition: (formData.get("imagePosition") as string)?.trim() || null,
      })
      .where(eq(teamMembers.id, id));
  } catch (error) {
    console.error("Failed to update team member:", error);
    return { error: "Failed to update team member. Please try again." };
  }

  revalidateTeam();
  redirect("/admin/team");
}

/**
 * Moves a member one position earlier ("up") or later ("down") within the
 * group it is displayed in (same year, section, and committee title). Swaps by
 * reassigning the group's existing sortOrder values, so other groups keep their
 * relative position.
 */
export async function moveTeamMember(formData: FormData) {
  await requireUser();

  const id = Number(formData.get("id"));
  const direction = formData.get("direction");
  if (!id || (direction !== "up" && direction !== "down")) return;

  const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
  if (!member) return;

  const group = await db
    .select()
    .from(teamMembers)
    .where(
      and(
        eq(teamMembers.year, member.year),
        eq(teamMembers.section, member.section),
        member.committeeTitle
          ? eq(teamMembers.committeeTitle, member.committeeTitle)
          : isNull(teamMembers.committeeTitle)
      )
    )
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id));

  const idx = group.findIndex((m) => m.id === id);
  const target = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || target < 0 || target >= group.length) return;

  // Existing order values, kept as the canonical slots for this group.
  const orders = group.map((m) => m.sortOrder).sort((a, b) => a - b);
  [group[idx], group[target]] = [group[target], group[idx]];

  try {
    await Promise.all(
      group.map((m, position) =>
        db
          .update(teamMembers)
          .set({ sortOrder: orders[position] })
          .where(eq(teamMembers.id, m.id))
      )
    );
  } catch (error) {
    console.error("Failed to reorder team member:", error);
    return;
  }

  revalidateTeam();
}

export async function deleteTeamMember(formData: FormData) {
  await requireUser();

  const id = Number(formData.get("id"));
  if (!id) return;

  try {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  } catch (error) {
    console.error("Failed to delete team member:", error);
    return;
  }

  revalidateTeam();
}
