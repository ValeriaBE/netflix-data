import { CHAPTERS } from "../../app/constants";
import { theme } from "../../styles/theme";
import { useStoryStore } from "../../state/storyStore";

export function SidePanel({ total }: { total: number }) {
  const chapterIndex = useStoryStore((s) => s.chapterIndex);
  const focus = useStoryStore((s) => s.focus);
  const chapter = CHAPTERS[chapterIndex];

  return (
    <aside
      style={{
        width: 360,
        background: theme.colors.panel,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.card,
        boxShadow: `0 10px 30px ${theme.colors.shadow}`,
        position: "sticky",
        top: theme.spacing.page,
        height: "fit-content",
      }}
    >
      <div style={{ fontSize: 12, color: theme.colors.muted, marginBottom: 8 }}>
        Chapter {chapterIndex + 1} of {CHAPTERS.length}
      </div>
      <div style={{ fontSize: 20, fontWeight: 950, marginBottom: 10 }}>{chapter.title}</div>
      <div style={{ color: theme.colors.muted, lineHeight: 1.5 }}>{chapter.description}</div>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <div
          style={{
            background: theme.colors.bg,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.md,
            padding: 12,
          }}
        >
          <div style={{ fontSize: 12, color: theme.colors.muted }}>Focus</div>
          <div style={{ fontSize: 16, fontWeight: 900, marginTop: 4 }}>
            {focus === "both" ? "United States + Canada" : focus === "us" ? "United States" : "Canada"}
          </div>
        </div>

        <div
          style={{
            background: theme.colors.bg,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.md,
            padding: 12,
          }}
        >
          <div style={{ fontSize: 12, color: theme.colors.muted }}>Titles represented</div>
          <div style={{ fontSize: 26, fontWeight: 950, marginTop: 4 }}>{total.toLocaleString()}</div>
        </div>

        <div style={{ fontSize: 12, color: theme.colors.muted, lineHeight: 1.45 }}>
          Note: Titles are anonymized (e.g., “Title 1”). This experience focuses on strategy patterns (country/type/rating/genre),
          not individual shows.
        </div>
      </div>
    </aside>
  );
}
