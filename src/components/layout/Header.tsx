import { theme } from "../../styles/theme";

export function Header() {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 28, fontWeight: 950, letterSpacing: -0.4 }}>
        Netflix Title Journey
      </div>
      <div style={{ color: theme.colors.muted, marginTop: 6, maxWidth: 900, lineHeight: 1.45 }}>
        An interactive, animated exploration of Netflix’s production strategy comparing the United States and Canada.
      </div>
    </div>
  );
}
