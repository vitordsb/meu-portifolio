import type { ReactNode } from "react";

/**
 * "Eyebrow": label acima de títulos.
 * Assist chip do M3, no par primary-container / on-primary-container.
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
      className={`inline-flex h-8 items-center gap-2 rounded-[var(--shape-sm)] bg-primary-container px-3 text-on-primary-container label-large ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}
