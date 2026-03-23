"use client";

import { useState, useMemo } from "react";
import { Search, Download, FileText, ChevronUp, ChevronDown, Filter } from "lucide-react";
import { PLAN_DOCUMENTS } from "@/data/plans";
import { STATUS_META } from "@/data/counties";
import type { PlanDocument, PlanStatus, PlanType } from "@/types";

type SortKey = keyof Pick<PlanDocument, "countyName" | "type" | "year" | "status" | "submittedDate" | "expirationDate">;
type SortDir = "asc" | "desc";

function StatusBadge({ status }: { status: PlanStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`status-badge ${m.bg} ${m.color} border ${m.border} text-xs`}>
      {m.label}
    </span>
  );
}

function SortButton({
  col,
  current,
  dir,
  onClick,
  children,
}: {
  col: SortKey;
  current: SortKey;
  dir: SortDir;
  onClick: (col: SortKey) => void;
  children: React.ReactNode;
}) {
  const active = col === current;
  return (
    <button
      onClick={() => onClick(col)}
      className="flex items-center gap-0.5 group text-left focus:outline-none focus:underline"
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <span>{children}</span>
      <span className={`ml-0.5 ${active ? "text-blue-600" : "text-slate-300 group-hover:text-slate-400"}`}>
        {active && dir === "asc" ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </span>
    </button>
  );
}

const ALL_TYPES: PlanType[] = ["CEMP", "HMP", "EOP", "AAR", "CAP", "TRAINING"];
const ALL_STATUSES: PlanStatus[] = ["current", "due-soon", "overdue", "not-submitted"];

export default function PlansRepository() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<PlanType | "">("");
  const [filterStatus, setFilterStatus] = useState<PlanStatus | "">("");
  const [sortKey, setSortKey] = useState<SortKey>("countyName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (col: SortKey) => {
    if (col === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return PLAN_DOCUMENTS.filter((doc) => {
      const matchesSearch =
        !q ||
        doc.countyName.toLowerCase().includes(q) ||
        doc.type.toLowerCase().includes(q) ||
        doc.label.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        String(doc.year).includes(q);
      const matchesType = !filterType || doc.type === filterType;
      const matchesStatus = !filterStatus || doc.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    }).sort((a, b) => {
      const av = String(a[sortKey]);
      const bv = String(b[sortKey]);
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [search, filterType, filterStatus, sortKey, sortDir]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Repository Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-bold text-slate-800">Plans Repository</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Shared archive of county emergency plans, hazard mitigation documents, and after-action reports
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5 font-medium">
              {filtered.length} of {PLAN_DOCUMENTS.length} documents
            </span>
          </div>
        </div>

        {/* Search + Filter row */}
        <div className="mt-3 flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search county, plan type, or keyword…"
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search plans repository"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              showFilters || filterType || filterStatus
                ? "bg-blue-50 text-blue-700 border-blue-300"
                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
            }`}
            aria-expanded={showFilters}
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filterType || filterStatus) && (
              <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {(filterType ? 1 : 0) + (filterStatus ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="mt-2 flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as PlanType | "")}
              className="px-2 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by plan type"
            >
              <option value="">All Plan Types</option>
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as PlanStatus | "")}
              className="px-2 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_META[s].label}</option>
              ))}
            </select>
            {(filterType || filterStatus) && (
              <button
                onClick={() => { setFilterType(""); setFilterStatus(""); }}
                className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <FileText className="w-10 h-10 mb-2 text-slate-200" />
            <p className="text-sm font-medium">No documents match your search</p>
            <p className="text-xs mt-1">Try adjusting filters or keywords</p>
          </div>
        ) : (
          <table className="w-full text-sm border-collapse" role="grid">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">
                  <SortButton col="countyName" current={sortKey} dir={sortDir} onClick={handleSort}>
                    County
                  </SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-20">
                  <SortButton col="type" current={sortKey} dir={sortDir} onClick={handleSort}>
                    Type
                  </SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                  Document
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-28 hidden sm:table-cell">
                  <SortButton col="submittedDate" current={sortKey} dir={sortDir} onClick={handleSort}>
                    Submitted
                  </SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-28 hidden sm:table-cell">
                  <SortButton col="expirationDate" current={sortKey} dir={sortDir} onClick={handleSort}>
                    Expires
                  </SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">
                  <SortButton col="status" current={sortKey} dir={sortDir} onClick={handleSort}>
                    Status
                  </SortButton>
                </th>
                <th className="px-4 py-3 w-16 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  File
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {doc.countyName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="font-medium text-slate-700 text-xs leading-snug">
                      {doc.label}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                      {doc.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs hidden sm:table-cell">
                    {formatDate(doc.submittedDate)}
                  </td>
                  <td className="px-4 py-3 text-xs hidden sm:table-cell">
                    <span className={doc.status === "overdue" ? "text-orange-700 font-medium" : doc.status === "due-soon" ? "text-yellow-700 font-medium" : "text-slate-600"}>
                      {formatDate(doc.expirationDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        alert(`In production, this would download the ${doc.type} for ${doc.countyName} County (${doc.fileSize}).`)
                      }
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1.5 py-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                      title={`Download ${doc.label}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{doc.fileSize}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer note */}
      <div className="px-5 py-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 flex items-center gap-2">
        <span>
          Plans shared here are accessible to all KYEM regional coordinators and county EM directors.
        </span>
        <span className="ml-auto text-slate-300">·</span>
        <span>Transparency &amp; shared situational awareness</span>
      </div>
    </div>
  );
}
