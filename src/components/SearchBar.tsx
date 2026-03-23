"use client";

import { Search, X } from "lucide-react";
import { useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  resultCount?: number;
}

export default function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search
          className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by county name or EM director…"
          className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          aria-label="Search counties or officials"
          autoComplete="off"
          spellCheck={false}
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {value && resultCount !== undefined && (
        <p className="mt-1 text-xs text-slate-500" aria-live="polite">
          {resultCount === 0
            ? "No counties found"
            : `${resultCount} ${resultCount === 1 ? "county" : "counties"} found`}
        </p>
      )}
    </div>
  );
}
