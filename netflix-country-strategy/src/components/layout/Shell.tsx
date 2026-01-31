import type { PropsWithChildren } from "react";
import { theme } from "../../styles/theme";

export function Shell({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.bg,
        padding: theme.spacing.page,
      }}
    >
      {children}
    </div>
  );
}
