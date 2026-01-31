import * as Papa from "papaparse";
import type { RawRow, TitleDatum } from "../model/types";

// Helpers to survive weird CSV headers like "Country " or "Country\r"
function getField(row: Record<string, any>, candidates: string[]) {
  for (const k of candidates) {
    if (row[k] != null && String(row[k]).trim() !== "") return row[k];
  }
  // fallback: try fuzzy match ignoring whitespace
  const keys = Object.keys(row);
  for (const cand of candidates) {
    const candNorm = cand.replace(/\s+/g, "").toLowerCase();
    const found = keys.find((kk) => kk.replace(/\s+/g, "").toLowerCase() === candNorm);
    if (found && row[found] != null && String(row[found]).trim() !== "") return row[found];
  }
  return undefined;
}

function normalizeCountry(raw: string): string {
  const s = (raw ?? "").trim();
  const aliases: Record<string, string> = {
    USA: "United States",
    "United States of America": "United States",
    "U.S.": "United States",
  };
  return aliases[s] ?? s;
}

function normalizeType(raw: string): "Movie" | "TV Show" | "Other" {
  const s = (raw ?? "").trim().toLowerCase();
  if (s === "movie") return "Movie";
  if (s === "tv show" || s === "tv") return "TV Show";
  return "Other";
}

function parseYear(raw: any): number | null {
  const n = Number(String(raw ?? "").trim());
  return Number.isFinite(n) && n > 1800 && n < 2100 ? n : null;
}

export async function loadNetflixCsv(): Promise<TitleDatum[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/Netflix_Movies_and_TV_Shows.csv`);
  if (!res.ok) throw new Error(`Failed to load CSV: ${res.status} ${res.statusText}`);
  const text = await res.text();

  const parsed = Papa.parse<Record<string, any>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  // ✅ Debug once in dev: tells us exactly what the browser thinks the headers are
  console.log("CSV headers:", parsed.meta.fields);

  if (parsed.errors?.length) {
    console.warn("CSV parse warnings:", parsed.errors.slice(0, 5));
  }

  const focus = new Set(["United States", "Canada"]);

  const out: TitleDatum[] = [];
  let id = 0;

  for (const row of parsed.data ?? []) {
    const rawCountry = getField(row, ["Country", "country"]);
    if (!rawCountry) continue;

    const country = normalizeCountry(String(rawCountry));
    if (!focus.has(country)) continue;

    const rawType = getField(row, ["Type", "type"]);
    const rawGenre = getField(row, ["Genre", "genre"]);
    const rawRating = getField(row, ["Rating", "rating"]);
    const rawYear = getField(row, ["Release Year", "ReleaseYear", "release_year", "Year"]);
    const rawDuration = getField(row, ["Duration", "duration"]);

    out.push({
      id: id++,
      country: country as "United States" | "Canada",
      type: normalizeType(String(rawType ?? "")),
      genre: String(rawGenre ?? "Unknown").trim() || "Unknown",
      rating: String(rawRating ?? "Unrated").trim() || "Unrated",
      year: parseYear(rawYear),
      duration: String(rawDuration ?? "").trim(),
    });
  }

  console.log("US+Canada rows after filter:", out.length);
  console.log("Sample parsed row:", out[0]);

  return out;
}
