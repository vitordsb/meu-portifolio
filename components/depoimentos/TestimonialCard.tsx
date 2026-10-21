import { BadgeCheck, Star } from "lucide-react";
import type { PublicTestimonial } from "@/lib/testimonials/types";

/**
 * Card de depoimento: o mesmo na home e na prévia do formulário (o cliente
 * vê exatamente como vai ficar). Card de informação, então quadrado; a foto
 * redonda é a única exceção à regra de forma.
 */
export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          aria-hidden
          className={n <= value ? "fill-on-surface text-on-surface" : "text-outline-variant"}
        />
      ))}
    </span>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function TestimonialCard({
  t,
  pt,
  compact = false,
}: {
  t: Pick<PublicTestimonial, "name" | "role" | "projectName" | "photoUrl" | "quote" | "rating" | "verified">;
  pt: boolean;
  /** Versão menor, por cima da imagem do case. */
  compact?: boolean;
}) {
  const sub = [t.role, t.projectName].filter(Boolean).join(" · ");
  const avatar = compact ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm";
  return (
    <figure className={`flex h-full flex-col border border-outline-variant bg-surface ${compact ? "p-4" : "p-6"}`}>
      <Stars value={t.rating} size={compact ? 13 : 16} />
      <blockquote
        className={`flex-1 whitespace-pre-line break-words leading-relaxed ${compact ? "mt-2.5 text-sm" : "mt-4 text-base"}`}
      >
        {t.quote}
      </blockquote>
      <figcaption className={`flex items-center gap-3 ${compact ? "mt-3" : "mt-6"}`}>
        {t.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.photoUrl}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            className={`${avatar} shrink-0 rounded-full object-cover`}
          />
        ) : (
          <span
            aria-hidden
            className={`${avatar} flex shrink-0 items-center justify-center rounded-full bg-surface-low font-semibold text-on-surface-variant`}
          >
            {initials(t.name) || "?"}
          </span>
        )}
        <span className="min-w-0">
          <span className={`block truncate font-semibold ${compact ? "text-sm" : ""}`}>{t.name}</span>
          {sub && (
            <span className={`block truncate text-on-surface-variant ${compact ? "text-xs" : "text-sm"}`}>{sub}</span>
          )}
          {t.verified && (
            <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-on-surface-variant">
              <BadgeCheck size={13} aria-hidden />
              {pt ? "Cliente verificado" : "Verified client"}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
