import { getTeamData } from "@/lib/team";
import { TeamView } from "@/components/TeamView";

export default async function TeamPage() {
  const data = await getTeamData();
  return <TeamView data={data} />;
}
