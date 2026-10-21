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
}: {
  t: Pick<PublicTestimonial, "name" | "role" | "projectName" | "photoUrl" | "quote" | "rating" | "verified">;
  pt: boolean;
}) {
  const sub = [t.role, t.projectName].filter(Boolean).join(" · ");
  return (
    <figure className="flex h-full flex-col border border-outline-variant bg-surface p-6">
      <Stars value={t.rating} />
      <blockquote className="mt-4 flex-1 whitespace-pre-line break-words text-base leading-relaxed">
        {t.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {t.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.photoUrl}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-low text-sm font-semibold text-on-surface-variant"
          >
            {initials(t.name) || "?"}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate font-semibold">{t.name}</span>
          {sub && <span className="block truncate text-sm text-on-surface-variant">{sub}</span>}
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
