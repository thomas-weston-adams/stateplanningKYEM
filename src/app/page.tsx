"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Fuse from "fuse.js";
import { Users, MapPin, TrendingUp, AlertTriangle } from "lucide-react";

import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import CountyPanel from "@/components/CountyPanel";
import StatusLegend from "@/components/StatusLegend";
import PlansRepository from "@/components/PlansRepository";

import { KENTUCKY_COUNTIES } from "@/data/counties";
import type { County } from "@/types";

// Dynamically import the map so it only renders client-side (uses browser APIs)
const KentuckyMap = dynamic(() => import("@/components/KentuckyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-slate-100 rounded-lg">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading Kentucky county map…</p>
      </div>
    </div>
  ),
});

// Build Fuse.js index over county names and director names
const fuse = new Fuse(KENTUCKY_COUNTIES, {
  keys: [
    { name: "name", weight: 2 },
    { name: "director.name", weight: 1.5 },
    { name: "region", weight: 0.5 },
  ],
  threshold: 0.35,
  includeScore: true,
});

// Stat card data
const STATUS_COUNTS = {
  current: KENTUCKY_COUNTIES.filter((c) => c.status === "current").length,
  dueSoon: KENTUCKY_COUNTIES.filter((c) => c.status === "due-soon").length,
  overdue: KENTUCKY_COUNTIES.filter((c) => c.status === "overdue").length,
  notSubmitted: KENTUCKY_COUNTIES.filter((c) => c.status === "not-submitted").length,
};

function StatCard({
  icon,
  label,
  count,
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  colorClass: string;
}) {
  return (
    <div className={`bg-white rounded-lg border ${colorClass} px-4 py-3 flex items-center gap-3`}>
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <div className="text-xl font-bold text-slate-800 leading-none">{count}</div>
        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"map" | "plans">("map");
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // Fuse search results
  const searchResults = useMemo<County[]>(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).map((r) => r.item);
  }, [searchQuery]);

  // Counties highlighted on map (search matches)
  const highlightedFips = useMemo<Set<string>>(() => {
    if (!searchQuery.trim()) return new Set();
    return new Set(searchResults.map((c) => c.fips));
  }, [searchResults, searchQuery]);

  const handleCountySelect = useCallback((county: County) => {
    setSelectedCounty(county);
    setSearchQuery("");
    setShowResults(false);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setShowResults(true);
    if (!val.trim()) {
      setSelectedCounty(null);
    }
  };

  const handleSearchBlur = () => {
    // Delay to allow click on result
    setTimeout(() => setShowResults(false), 150);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "map" ? (
          <>
            {/* Top bar: search + stats */}
            <div className="bg-white border-b border-slate-200 px-4 py-3">
              <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Search */}
                <div
                  ref={searchWrapperRef}
                  className="relative w-full sm:max-w-md"
                  onBlur={handleSearchBlur}
                >
                  <SearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                    resultCount={searchQuery.trim() ? searchResults.length : undefined}
                  />
                  {showResults && searchQuery.trim() && (
                    <SearchResults
                      results={searchResults}
                      query={searchQuery}
                      selectedFips={selectedCounty?.fips ?? null}
                      onSelect={handleCountySelect}
                    />
                  )}
                </div>

                {/* Stat summary chips */}
                <div className="flex gap-2 flex-wrap">
                  <StatCard
                    icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                    label="Current"
                    count={STATUS_COUNTS.current}
                    colorClass="border-green-200"
                  />
                  <StatCard
                    icon={<Users className="w-5 h-5 text-yellow-600" />}
                    label="Due Soon"
                    count={STATUS_COUNTS.dueSoon}
                    colorClass="border-yellow-200"
                  />
                  <StatCard
                    icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
                    label="Overdue"
                    count={STATUS_COUNTS.overdue}
                    colorClass="border-orange-200"
                  />
                  <StatCard
                    icon={<MapPin className="w-5 h-5 text-red-600" />}
                    label="Not Submitted"
                    count={STATUS_COUNTS.notSubmitted}
                    colorClass="border-red-200"
                  />
                </div>
              </div>
            </div>

            {/* Map + Panel */}
            <div className="flex-1 overflow-hidden flex">
              {/* Map */}
              <div className="flex-1 p-3 min-w-0">
                <KentuckyMap
                  selectedFips={selectedCounty?.fips ?? null}
                  highlightedFips={highlightedFips}
                  onCountySelect={handleCountySelect}
                />
              </div>

              {/* County Detail Panel */}
              <div
                className={`flex-shrink-0 border-l border-slate-200 bg-white transition-all duration-300 overflow-hidden ${
                  selectedCounty ? "w-80 xl:w-96" : "w-72"
                }`}
                aria-label="County details"
              >
                <CountyPanel
                  county={selectedCounty}
                  onClose={() => setSelectedCounty(null)}
                />
              </div>
            </div>

            {/* Status Legend */}
            <StatusLegend />
          </>
        ) : (
          <div className="flex-1 overflow-hidden">
            <PlansRepository />
          </div>
        )}
      </main>
    </div>
  );
}
