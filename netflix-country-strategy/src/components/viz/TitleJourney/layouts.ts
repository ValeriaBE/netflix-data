import type { NodeDatum } from "./types";
import type { ChapterKey } from "../../../app/constants";

const pad = 34;

export function getTargets(
  key: ChapterKey,
  nodes: NodeDatum[],
  width: number,
  height: number
): Map<number, { x: number; y: number; group: string }> {
  const targets = new Map<number, { x: number; y: number; group: string }>();

  const cx = width / 2;
  const cy = height / 2;

  // Helper to place groups in a grid
  const unique = <T,>(arr: T[]) => Array.from(new Set(arr));

  if (key === "catalog") {
    // Country split left/right
    for (const n of nodes) {
      const left = n.country === "United States";
      targets.set(n.id, {
        x: left ? cx - width * 0.18 : cx + width * 0.18,
        y: cy,
        group: n.country,
      });
    }
    return targets;
  }

  if (key === "rating") {
    const ratings = unique(nodes.map((n) => n.rating)).slice(0, 8); // keep manageable for first pass
    const cols = 4;
    const cellW = (width - pad * 2) / cols;
    const rows = Math.ceil(ratings.length / cols);
    const cellH = (height - pad * 2) / Math.max(1, rows);

    const pos = new Map<string, { x: number; y: number }>();
    ratings.forEach((r, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      pos.set(r, { x: pad + col * cellW + cellW / 2, y: pad + row * cellH + cellH / 2 });
    });

    for (const n of nodes) {
      const p = pos.get(n.rating) ?? { x: cx, y: cy };
      targets.set(n.id, { ...p, group: n.rating });
    }
    return targets;
  }

  if (key === "genre") {
    // Top N genres by frequency
    const counts = new Map<string, number>();
    nodes.forEach((n) => counts.set(n.genre, (counts.get(n.genre) ?? 0) + 1));
    const topGenres = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([g]) => g);

    const cols = 4;
    const cellW = (width - pad * 2) / cols;
    const rows = Math.ceil(topGenres.length / cols);
    const cellH = (height - pad * 2) / Math.max(1, rows);

    const pos = new Map<string, { x: number; y: number }>();
    topGenres.forEach((g, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      pos.set(g, { x: pad + col * cellW + cellW / 2, y: pad + row * cellH + cellH / 2 });
    });

    for (const n of nodes) {
      const group = topGenres.includes(n.genre) ? n.genre : "Other";
      const p = pos.get(group) ?? { x: cx, y: cy };
      targets.set(n.id, { ...p, group });
    }
    return targets;
  }

  // key === "type"
  for (const n of nodes) {
    const isMovie = n.type === "Movie";
    targets.set(n.id, {
      x: isMovie ? cx - width * 0.18 : cx + width * 0.18,
      y: cy,
      group: n.type,
    });
  }
  return targets;
}
