import { theme } from "../../styles/theme";

type Option<T extends string> = { value: T; label: string };

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 6,
        padding: 6,
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.panel,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: theme.radius.md,
              padding: "8px 10px",
              background: active ? theme.colors.accent : "transparent",
              color: theme.colors.text,
              fontWeight: 800,
              opacity: active ? 1 : 0.8,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
