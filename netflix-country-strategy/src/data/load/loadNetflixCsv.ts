import * as Papa from "papaparse";
import type { RawRow, TitleDatum } from "../model/types";
import { FOCUS_COUNTRIES } from "../../app/constants";

function normalizeCountry(raw: string): string {
  const s = (raw ?? "").trim();

  // Handle common variants if needed
  const aliases: Record<string, string> = {
    USA: "United States",
    "United States of America": "United States"
  };

  return aliases[s] ?? s;
}

function normalizeType(raw: string): "Movie" | "TV Show" | "Other" {
  const s = (raw ?? "").trim().toLowerCase();
  if (s === "movie") return "Movie";
  if (s === "tv show" || s === "tv") return "TV Show";
  return "Other";
}

function parseYear(raw: string): number | null {
  const n = Number(String(raw ?? "").trim());
  return Number.isFinite(n) && n > 1800 && n < 2100 ? n : null;
}

export async function loadNetflixCsv(): Promise<TitleDatum[]> {
  const res = await fetch("/data/Netflix_Movies_and_TV_Shows.csv");
  if (!res.ok) throw new Error(`Failed to load CSV: ${res.status} ${res.statusText}`);
  const text = await res.text();

  const parsed = Papa.parse<RawRow>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (parsed.errors?.length) {
    console.warn("CSV parse warnings:", parsed.errors.slice(0, 5));
  }

  const rows = (parsed.data ?? []).filter((r) => r && r.Country);

  const out: TitleDatum[] = [];
  let id = 0;

  for (const r of rows) {
    const c = normalizeCountry(r.Country);
    const isUS = c === FOCUS_COUNTRIES.US;
    const isCA = c === FOCUS_COUNTRIES.CA;
    if (!isUS && !isCA) continue; // focus only

    out.push({
      id: id++,
      country: isUS ? "United States" : "Canada",
      type: normalizeType(r.Type),
      genre: (r.Genre ?? "Unknown").trim() || "Unknown",
      rating: (r.Rating ?? "Unrated").trim() || "Unrated",
      year: parseYear(r["Release Year"]),
      duration: (r.Duration ?? "").trim(),
    });
  }

  return out;
}
