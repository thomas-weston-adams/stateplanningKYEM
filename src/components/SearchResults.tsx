"use client";

import { MapPin, User, CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import type { County, PlanStatus } from "@/types";
import { STATUS_META, MAP_COLORS } from "@/data/counties";

interface SearchResultsProps {
  results: County[];
  query: string;
  selectedFips: string | null;
  onSelect: (county: County) => void;
}

function StatusIcon({ status }: { status: PlanStatus }) {
  const props = { className: "w-3.5 h-3.5 flex-shrink-0" };
  switch (status) {
    case "current": return <CheckCircle2 {...props} style={{ color: "#16A34A" }} />;
    case "due-soon": return <Clock {...props} style={{ color: "#CA8A04" }} />;
    case "overdue": return <AlertTriangle {...props} style={{ color: "#EA580C" }} />;
    case "not-submitted": return <XCircle {...props} style={{ color: "#DC2626" }} />;
  }
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="search-highlight">{text.slice(idx, idx + query.trim().length)}</mark>
      {text.slice(idx + query.trim().length)}
    </>
  );
}

export default function SearchResults({
  results,
  query,
  selectedFips,
  onSelect,
}: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
      <div className="px-3 py-2 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {results.length} {results.length === 1 ? "result" : "results"}
      </div>
      <ul role="listbox" aria-label="County search results">
        {results.map((county) => {
          const meta = STATUS_META[county.status];
          const isSelected = county.fips === selectedFips;
          const directorMatchesQuery =
            query.trim() &&
            county.director.name.toLowerCase().includes(query.toLowerCase().trim());

          return (
            <li key={county.fips} role="option" aria-selected={isSelected}>
              <button
                className={`w-full text-left px-3 py-2.5 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 flex items-start gap-3 transition-colors ${
                  isSelected ? "bg-blue-50" : ""
                }`}
                onClick={() => onSelect(county)}
              >
                {/* Status dot */}
                <span
                  className="mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 border border-black/10"
                  style={{ backgroundColor: MAP_COLORS[county.status] }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" aria-hidden="true" />
                      {highlight(county.name, query)} County
                    </span>
                    <span className={`text-xs font-medium ${meta.color} flex-shrink-0`}>
                      <StatusIcon status={county.status} />
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3" aria-hidden="true" />
                    {directorMatchesQuery
                      ? highlight(county.director.name, query)
                      : county.director.name}
                    {" · "}
                    <span className={meta.color}>{meta.label}</span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
