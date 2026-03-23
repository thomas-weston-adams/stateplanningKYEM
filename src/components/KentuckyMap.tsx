"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  type Geography as GeoType,
} from "react-simple-maps";
import { useState, useCallback } from "react";
import { MAP_COLORS, COUNTIES_BY_FIPS, STATUS_META } from "@/data/counties";
import type { County } from "@/types";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

interface KentuckyMapProps {
  selectedFips: string | null;
  highlightedFips: Set<string>;
  onCountySelect: (county: County) => void;
}

export default function KentuckyMap({
  selectedFips,
  highlightedFips,
  onCountySelect,
}: KentuckyMapProps) {
  const [tooltip, setTooltip] = useState<{
    name: string;
    status: string;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseMove = useCallback(
    (county: County, evt: React.MouseEvent<SVGPathElement>) => {
      const rect = (evt.currentTarget as SVGElement)
        .closest("svg")
        ?.getBoundingClientRect();
      if (!rect) return;
      setTooltip({
        name: `${county.name} County`,
        status: STATUS_META[county.status].label,
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const getFillColor = (fips: string): string => {
    const county = COUNTIES_BY_FIPS[fips];
    if (!county) return "#CBD5E1";

    const hasSearch = highlightedFips.size > 0;
    const isHighlighted = highlightedFips.has(fips);
    const isSelected = selectedFips === fips;

    if (isSelected) return "#C8A951"; // KYEM gold for selected
    if (hasSearch && !isHighlighted) return "#E2E8F0"; // dim non-matches
    return MAP_COLORS[county.status];
  };

  const getStroke = (fips: string): string => {
    if (selectedFips === fips) return "#1B3A6B";
    if (highlightedFips.has(fips)) return "#2A5298";
    return "#FFFFFF";
  };

  const getStrokeWidth = (fips: string): number => {
    if (selectedFips === fips) return 2;
    if (highlightedFips.has(fips)) return 1.5;
    return 0.5;
  };

  return (
    <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 5800,
          center: [-85.6, 37.6],
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          center={[0, 0]}
          zoom={1}
          minZoom={1}
          maxZoom={8}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoType[] }) =>
              geographies
                .filter((geo: GeoType) => geo.id.startsWith("21"))
                .map((geo: GeoType) => {
                  const county = COUNTIES_BY_FIPS[geo.id];
                  if (!county) return null;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getFillColor(geo.id)}
                      stroke={getStroke(geo.id)}
                      strokeWidth={getStrokeWidth(geo.id)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${county.name} County – ${STATUS_META[county.status].label}`}
                      onClick={() => onCountySelect(county)}
                      onMouseMove={(evt: React.MouseEvent<SVGPathElement>) => handleMouseMove(county, evt)}
                      onMouseLeave={handleMouseLeave}
                      onKeyDown={(e: React.KeyboardEvent<SVGPathElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onCountySelect(county);
                        }
                      }}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 bg-gray-900/90 text-white text-xs rounded-md px-2.5 py-1.5 shadow-lg backdrop-blur-sm"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 36,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
          role="tooltip"
        >
          <div className="font-semibold">{tooltip.name}</div>
          <div className="text-gray-300">{tooltip.status}</div>
        </div>
      )}

      {/* Zoom hint */}
      <div className="absolute bottom-2 left-2 text-xs text-slate-400 bg-white/70 rounded px-2 py-1 pointer-events-none">
        Scroll to zoom · Drag to pan · Click county for details
      </div>
    </div>
  );
}
