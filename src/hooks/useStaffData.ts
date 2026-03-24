"use client";

import { useState, useEffect } from "react";

export interface StaffMember {
  name: string;
  position: string;
  officePhone: string;
  cellPhone: string;
  email: string;
  eocAddress: string;
}

export type StaffByCounty = Record<string, StaffMember[]>;

// Parse a single CSV row respecting double-quote escaping
function parseRow(row: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQ = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQ && row[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
    } else if (ch === "," && !inQ) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

function clean(s: string): string {
  // Remove non-printable / garbled bytes and trim
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\u0000-\u001F\u0080-\u009F\uFFFD]/g, "").trim();
}

const POSITION_ORDER: Record<string, number> = {
  "em director": 0,
  "interim em director": 1,
  "interim director": 1,
  "deputy em director": 2,
  "deputy director": 2,
};

function sortStaff(a: StaffMember, b: StaffMember): number {
  const pa = POSITION_ORDER[a.position.toLowerCase()] ?? 9;
  const pb = POSITION_ORDER[b.position.toLowerCase()] ?? 9;
  return pa - pb;
}

// Module-level cache so we only fetch once
let cache: StaffByCounty | null = null;
let pending: Promise<StaffByCounty> | null = null;

const CSV_URL = "/stateplanningKYEM/staff-ema.csv";

async function loadStaff(): Promise<StaffByCounty> {
  if (cache) return cache;
  if (pending) return pending;

  pending = fetch(CSV_URL)
    .then((r) => r.text())
    .then((text) => {
      const lines = text.split(/\r?\n/);
      const byCounty: StaffByCounty = {};

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const cols = parseRow(line);
        const county = clean(cols[0] ?? "");
        const name = clean(cols[3] ?? "");

        // Skip blank, "City of …", or clearly invalid rows
        if (!county || !name || county.toLowerCase().startsWith("city of")) continue;

        const position = clean(cols[4] ?? "");
        const officePhone = clean(cols[5] ?? "");
        const cellPhone = clean(cols[6] ?? "");
        const email = clean(cols[7] ?? "");
        const eocAddress = clean(cols[1] ?? "");

        // Skip rows where contact info is "Do NOT contact directly"
        if (name.toLowerCase().includes("do not")) continue;

        const key = county.toLowerCase();
        if (!byCounty[key]) byCounty[key] = [];
        byCounty[key].push({ name, position, officePhone, cellPhone, email, eocAddress });
      }

      // Sort each county's staff by role
      for (const key of Object.keys(byCounty)) {
        byCounty[key].sort(sortStaff);
      }

      cache = byCounty;
      return byCounty;
    });

  return pending;
}

export function useStaffData(): { staff: StaffByCounty; loading: boolean } {
  const [staff, setStaff] = useState<StaffByCounty>(cache ?? {});
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) {
      setStaff(cache);
      setLoading(false);
      return;
    }
    loadStaff()
      .then((data) => {
        setStaff(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load staff data:", err);
        setLoading(false);
      });
  }, []);

  return { staff, loading };
}
