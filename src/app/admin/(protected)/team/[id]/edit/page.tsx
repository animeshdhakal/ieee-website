import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTeamMemberById } from "@/lib/team";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export const metadata = {
  title: "Edit Team Member | Admin",
};

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getTeamMemberById(Number(id));
  if (!member) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/team"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-ieee-blue transition-colors"
      >
        <ArrowLeft size={16} /> Back to Team
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Team Member</h1>
        <p className="text-gray-500 mt-1">
          Update {member.name}&apos;s details.
        </p>
      </div>

      <TeamMemberForm member={member} />
    </div>
  );
}
