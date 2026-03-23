import { MAP_COLORS, STATUS_META } from "@/data/counties";
import { KENTUCKY_COUNTIES } from "@/data/counties";
import type { PlanStatus } from "@/types";

const STATUSES: PlanStatus[] = ["current", "due-soon", "overdue", "not-submitted"];

export default function StatusLegend() {
  const counts = STATUSES.reduce(
    (acc, s) => {
      acc[s] = KENTUCKY_COUNTIES.filter((c) => c.status === s).length;
      return acc;
    },
    {} as Record<PlanStatus, number>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 bg-white border-t border-slate-200">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Plan Status
      </span>
      {STATUSES.map((s) => {
        const meta = STATUS_META[s];
        return (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-3.5 rounded-sm flex-shrink-0 border border-black/10"
              style={{ backgroundColor: MAP_COLORS[s] }}
              aria-hidden="true"
            />
            <span className="text-xs text-slate-700">
              {meta.label}
              <span className="ml-1 text-slate-400">({counts[s]})</span>
            </span>
          </div>
        );
      })}
      <span className="ml-auto text-xs text-slate-400">120 Kentucky Counties</span>
    </div>
  );
}
