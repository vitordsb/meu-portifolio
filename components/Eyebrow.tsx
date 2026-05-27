import type { ReactNode } from "react";

/**
 * "Eyebrow" — label pequeno acima de títulos.
 * Substitui o padrão antigo "[ TEXTO ]" por um traço accent + texto,
 * mais refinado visualmente.
 */
export function Eyebrow({
  children,
  className = "",
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-accent ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      <span className="h-px w-7 bg-accent/60" />
      {children}
    </span>
  );
}
