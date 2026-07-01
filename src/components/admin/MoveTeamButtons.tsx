import { ChevronUp, ChevronDown } from "lucide-react";
import { moveTeamMember } from "@/actions/team";

const btnClass =
  "inline-flex items-center justify-center p-2 bg-white/90 text-gray-500 hover:text-ieee-blue rounded-lg shadow-sm transition-colors";

/**
 * Up/down controls that move a member one slot earlier or later within its
 * display group. Plain server-action forms — no client JS needed.
 */
export function MoveTeamButtons({ id }: { id: number }) {
  return (
    <div className="flex gap-1">
      <form action={moveTeamMember}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <button type="submit" title="Move earlier" className={btnClass}>
          <ChevronUp size={16} />
        </button>
      </form>
      <form action={moveTeamMember}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <button type="submit" title="Move later" className={btnClass}>
          <ChevronDown size={16} />
        </button>
      </form>
    </div>
  );
}
