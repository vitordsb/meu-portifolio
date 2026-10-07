"use client";

import { ArrowUpRight, Lock } from "lucide-react";
import type { CatalogProject } from "@/lib/projects-catalog";
import { linkLabelFor, storeOf } from "@/lib/store-links";
import ClayMockup from "./ClayMockup";

/** Projeto entregue: mockup de argila com os prints, nome, cliente e link. */
export default function ProjectTile({
  project,
  pt,
  compact = false,
}: {
  project: CatalogProject;
  pt: boolean;
  /** Dentro do painel dos serviços: menor. */
  compact?: boolean;
}) {
  const { title, client, link } = project;
  const store = storeOf(link);
  const linkText = !link
    ? project.offline
      ? pt
        ? "Projeto entregue"
        : "Delivered project"
      : pt
        ? "Projeto privado"
        : "Private project"
    : store
      ? pt
        ? "Ver na loja"
        : "View in store"
      : linkLabelFor(link);

  const body = (
    <>
      <ClayMockup
        shots={project.shots}
        label={title}
        className="ring-1 ring-outline-variant"
      />
      <div className={`flex items-start justify-between gap-3 ${compact ? "mt-2.5" : "mt-4"}`}>
        <div className="min-w-0">
          <p className={`truncate font-bold tracking-[-0.02em] ${compact ? "text-base" : "text-lg"}`}>{title}</p>
          {client && <p className="truncate text-sm text-on-surface-variant">{client}</p>}
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-on-surface-variant">
            {!link && !project.offline && <Lock size={12} className="shrink-0" />}
            {linkText}
          </p>
        </div>
        {link && <ArrowUpRight size={18} className="mt-1 shrink-0 text-on-surface-variant transition-colors group-hover:text-on-surface" />}
      </div>
    </>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="group block">
      {body}
    </a>
  ) : (
    <div className="group block">{body}</div>
  );
}
