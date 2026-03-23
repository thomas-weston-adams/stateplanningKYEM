"use client";

import { X, Phone, Mail, Calendar, FileText, CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import type { County, PlanStatus, CountyPlan } from "@/types";
import { STATUS_META } from "@/data/counties";

interface CountyPanelProps {
  county: County | null;
  onClose: () => void;
}

function StatusIcon({ status }: { status: PlanStatus }) {
  const icons = {
    current: <CheckCircle2 className="w-4 h-4 text-green-600" aria-hidden="true" />,
    "due-soon": <Clock className="w-4 h-4 text-yellow-600" aria-hidden="true" />,
    overdue: <AlertTriangle className="w-4 h-4 text-orange-600" aria-hidden="true" />,
    "not-submitted": <XCircle className="w-4 h-4 text-red-600" aria-hidden="true" />,
  };
  return icons[status];
}

function StatusBadge({ status }: { status: PlanStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`status-badge ${m.bg} ${m.color} border ${m.border}`}>
      <StatusIcon status={status} />
      {m.label}
    </span>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PlanRow({ plan }: { plan: CountyPlan }) {
  const m = STATUS_META[plan.status];
  return (
    <div className={`plan-row flex items-start gap-3 px-3 py-2.5 rounded-lg border ${m.border} ${m.bg} mb-2`}>
      <StatusIcon status={plan.status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-semibold text-sm text-slate-800">{plan.type}</span>
          <StatusBadge status={plan.status} />
        </div>
        <div className="text-xs text-slate-500 mt-0.5 truncate">{plan.label}</div>
        <div className="flex gap-4 mt-1 text-xs text-slate-500">
          <span>
            Submitted:{" "}
            <span className="text-slate-700">{formatDate(plan.lastSubmitted)}</span>
          </span>
          <span>
            Expires:{" "}
            <span className={plan.status === "overdue" ? "text-orange-700 font-medium" : "text-slate-700"}>
              {formatDate(plan.expirationDate)}
            </span>
          </span>
        </div>
      </div>
      {plan.fileId && (
        <button
          className="flex-shrink-0 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5"
          title={`View ${plan.type} document`}
          onClick={() => alert(`In a production environment, this would open the ${plan.type} document.`)}
        >
          <FileText className="w-3.5 h-3.5" />
          View
        </button>
      )}
    </div>
  );
}

export default function CountyPanel({ county, onClose }: CountyPanelProps) {
  if (!county) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-sm font-medium text-slate-500">Select a County</p>
        <p className="text-xs mt-1 max-w-[200px]">
          Click any county on the map or in search results to view its planning status.
        </p>
      </div>
    );
  }

  const overallMeta = STATUS_META[county.status];

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div
        className="flex items-start justify-between p-4 border-b border-slate-200"
        style={{ backgroundColor: "#1B3A6B" }}
      >
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white leading-tight">
            {county.name} County
          </h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-blue-200">{county.region}</span>
            <span className={`status-badge ${overallMeta.bg} ${overallMeta.color} border ${overallMeta.border}`}>
              <StatusIcon status={county.status} />
              {overallMeta.label}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 p-1.5 rounded-md text-blue-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          aria-label="Close county panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Director */}
        <section aria-labelledby="director-heading">
          <h3
            id="director-heading"
            className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
          >
            Emergency Management Director
          </h3>
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
            <p className="font-semibold text-slate-800">{county.director.name}</p>
            <p className="text-xs text-slate-500 mb-2">{county.director.title}</p>
            <div className="space-y-1">
              <a
                href={`tel:${county.director.phone}`}
                className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-700 group"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                {county.director.phone}
              </a>
              <a
                href={`mailto:${county.director.email}`}
                className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-700 group truncate"
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 group-hover:text-blue-500" />
                <span className="truncate">{county.director.email}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Last Communication */}
        <section>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Last Communication
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            {county.lastCommunication ? (
              <span className="text-slate-700">{formatDate(county.lastCommunication)}</span>
            ) : (
              <span className="text-red-600 italic">No record on file</span>
            )}
          </div>
        </section>

        {/* Plans */}
        <section aria-labelledby="plans-heading">
          <h3
            id="plans-heading"
            className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
          >
            Required Plans & Documents
          </h3>
          <div>
            {county.plans.map((plan) => (
              <PlanRow key={plan.type} plan={plan} />
            ))}
          </div>
        </section>

        {/* FIPS Reference */}
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
          FIPS Code: {county.fips} · {county.region}
        </div>
      </div>
    </div>
  );
}
