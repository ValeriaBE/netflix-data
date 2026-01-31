import type { PropsWithChildren } from "react";
import { theme } from "../../styles/theme";

type Props = PropsWithChildren<{
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}>;

export function Button({ children, onClick, disabled, variant = "ghost" }: Props) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        borderRadius: theme.radius.md,
        border: `1px solid ${isPrimary ? theme.colors.accent : theme.colors.border}`,
        padding: "10px 14px",
        background: isPrimary ? theme.colors.accent : "transparent",
        color: theme.colors.text,
        fontWeight: 800,
        boxShadow: isPrimary ? `0 10px 30px ${theme.colors.shadow}` : "none",
      }}
    >
      {children}
    </button>
  );
}
