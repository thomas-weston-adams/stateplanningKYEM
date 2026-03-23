"use client";

import { ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  activeTab: "map" | "plans";
  onTabChange: (tab: "map" | "plans") => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="w-full shadow-md"
      style={{ background: "linear-gradient(90deg, #1B3A6B 0%, #2A5298 100%)" }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 py-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#C8A951" }}
            >
              <ShieldCheck className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold text-base leading-tight truncate">
                KYEM Planning Dashboard
              </div>
              <div className="text-blue-200 text-xs leading-tight truncate">
                Kentucky Emergency Management · County Operations
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onTabChange("map")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                activeTab === "map"
                  ? "bg-white/20 text-white"
                  : "text-blue-200 hover:text-white hover:bg-white/10"
              }`}
              aria-current={activeTab === "map" ? "page" : undefined}
            >
              County Map
            </button>
            <button
              onClick={() => onTabChange("plans")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                activeTab === "plans"
                  ? "bg-white/20 text-white"
                  : "text-blue-200 hover:text-white hover:bg-white/10"
              }`}
              aria-current={activeTab === "plans" ? "page" : undefined}
            >
              Plans Repository
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 flex flex-col gap-1">
            <button
              onClick={() => { onTabChange("map"); setMobileMenuOpen(false); }}
              className={`px-4 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                activeTab === "map" ? "bg-white/20 text-white" : "text-blue-200"
              }`}
            >
              County Map
            </button>
            <button
              onClick={() => { onTabChange("plans"); setMobileMenuOpen(false); }}
              className={`px-4 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                activeTab === "plans" ? "bg-white/20 text-white" : "text-blue-200"
              }`}
            >
              Plans Repository
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
