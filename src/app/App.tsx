import { useEffect, useState } from "react";
import { Shell } from "../components/layout/Shell";
import { Header } from "../components/layout/Header";
import { SidePanel } from "../components/layout/SidePanel";
import { Button } from "../components/ui/Button";
import { Segmented } from "../components/ui/Segmented";
import { TitleJourney } from "../components/viz/TitleJourney/TitleJourney";
import { loadNetflixCsv } from "../data/load/loadNetflixCsv";
import { useStoryStore } from "../state/storyStore";
import type { TitleDatum } from "../data/model/types";
import { theme } from "../styles/theme";
import type { FocusMode } from "./constants";

export default function App() {
  const [data, setData] = useState<TitleDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const chapterIndex = useStoryStore((s) => s.chapterIndex);
  const setFocus = useStoryStore((s) => s.setFocus);
  const focus = useStoryStore((s) => s.focus);
  const next = useStoryStore((s) => s.next);
  const prev = useStoryStore((s) => s.prev);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const rows = await loadNetflixCsv();
        if (cancelled) return;
        setData(rows);
        console.log("Loaded rows:", rows.length);
console.log("Sample rows:", rows.slice(0, 5));

        setErr(null);
      } catch (e: any) {
        console.error(e);
        if (!cancelled) setErr(e?.message ?? "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Shell>
        <div style={{ color: theme.colors.text, fontSize: 16 }}>Loading…</div>
      </Shell>
    );
  }

  if (err) {
    return (
      <Shell>
        <div style={{ color: theme.colors.accent, fontWeight: 900, marginBottom: 8 }}>Error</div>
        <div style={{ color: theme.colors.muted }}>{err}</div>
      </Shell>
    );
  }

  const totalVisible =
    focus === "both" ? data.length : data.filter((d) => (focus === "us" ? d.country === "United States" : d.country === "Canada")).length;

  return (
    <Shell>
      <Header />

      <div style={{ display: "flex", gap: theme.spacing.gap, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Segmented<FocusMode>
              value={focus}
              onChange={setFocus}
              options={[
                { value: "both", label: "US + Canada" },
                { value: "us", label: "United States" },
                { value: "ca", label: "Canada" },
              ]}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <Button onClick={prev} disabled={chapterIndex === 0}>
                ← Back
              </Button>
              <Button onClick={next} variant="primary" disabled={chapterIndex === 3}>
                Next →
              </Button>
            </div>
          </div>

          <TitleJourney data={data} />
        </div>

        <SidePanel total={totalVisible} />
      </div>
    </Shell>
  );
}
