"use client";

import {
  ArrowUpRight,
  Cpu,
  Globe,
  Layers,
  LayoutDashboard,
  Lock,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/drizzle/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { RichText } from "@/components/RichText";
import { linkLabelFor, localizedStoreLink, storeCta, storeOf } from "@/lib/store-links";

// Ícone do placeholder quando o projeto não tem capa.
const CATEGORY_ICONS: { icon: LucideIcon; match: string[] }[] = [
  { icon: Smartphone, match: ["mobile", "app"] },
  { icon: Cpu, match: ["mobile + iot", "iot"] },
  { icon: LayoutDashboard, match: ["saas", "members area", "marketplace"] },
  { icon: Globe, match: ["site institucional", "landing page", "site artístico"] },
];

function iconFor(category: string): LucideIcon {
  const n = category.trim().toLowerCase();
  return CATEGORY_ICONS.find((c) => c.match.includes(n))?.icon ?? Layers;
}

/**
 * Card de projeto da home.
 *
 * A capa fica desfocada de propósito: os produtos são de clientes reais e estão
 * no ar, então a screenshot serve como textura, não como vitrine. Quem quiser
 * ver de verdade abre o link e visita o produto.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const { language } = useLanguage();
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const Icon = iconFor(project.category);

  const rawLink = project.liveLink;
  const store = storeOf(rawLink);
  const privateLabel = language === "pt" ? "PRIVADO" : "PRIVATE";
  const openLabel = store
    ? storeCta(store, language)
    : language === "pt"
      ? "Abrir site"
      : "Open site";

  const link = rawLink && store ? localizedStoreLink(rawLink, language) : rawLink;
  const linkLabel = link ? linkLabelFor(link) : "";

  return (
    <article className="group card-filled hover:border-primary transition flex w-full flex-col overflow-hidden p-0">
      <div className="relative aspect-video overflow-hidden border-b border-outline-variant bg-surface-high">
        {project.coverImageUrl ? (
          <>
            {/* Screenshot real, borrada. scale-110 esconde a borda transparente
                que o blur cria nas extremidades. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImageUrl}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 h-full w-full scale-110 select-none object-cover object-top blur-lg transition duration-500 group-hover:scale-[1.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface/85 via-surface/40 to-surface/10" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-highest">
            <Icon size={44} strokeWidth={1.25} className="text-primary/40" />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center p-4">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2 text-xs font-bold text-on-surface backdrop-blur-sm elev-1 transition hover:bg-primary hover:text-on-primary"
            >
              {openLabel}
              <ArrowUpRight size={14} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-surface/85 px-4 py-2 text-xs font-bold text-on-surface-variant backdrop-blur-sm">
              <Lock size={12} />
              {privateLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] tracking-widest text-primary">
            {project.category.toUpperCase()}
          </p>
          {project.period && (
            <span className="font-mono text-[10px] text-on-surface-variant/70">
              {project.period}
            </span>
          )}
        </div>

        <h3 className="mb-1 text-lg font-extrabold leading-tight">{project.title}</h3>
        <p className="mb-4 text-xs text-on-surface-variant">{project.company}</p>

        {/* Descrição inteira: o corte por line-clamp escondia justamente a parte
            que diz o que foi feito. */}
        <p className="mb-5 flex-1 text-sm leading-relaxed text-on-surface/75">
          <RichText text={project.description} />
        </p>

        {tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span key={tag} className="chip-static">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 border-t border-outline-variant pt-3 text-xs font-bold text-primary transition hover:opacity-80"
          >
            <ArrowUpRight size={14} />
            {linkLabel}
          </a>
        )}
      </div>
    </article>
  );
}
