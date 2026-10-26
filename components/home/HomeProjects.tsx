"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Facebook,
  Globe,
  Instagram,
  LayoutDashboard,
  Linkedin,
  Lock,
  MessageCircle,
  Music2,
  Smartphone,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { COMPANIES, type Company, type CompanyLink } from "@/lib/companies";
import { HOME_SECTIONS } from "@/lib/home-content";
import { whatsappCaseHref } from "@/lib/home-links";
import { PROJECT_SHOTS } from "@/lib/project-shots";
import { localizedStoreLink, storeCta, storeOf } from "@/lib/store-links";
import CaseTestimonials from "@/components/depoimentos/CaseTestimonials";
import type { PublicTestimonial } from "@/lib/testimonials/types";
import ClayMockup from "./ClayMockup";
import { caseTestimonials } from "./HomeTestimonials";
import { Section, SectionHeader } from "./ui";

const LINK_META: Record<CompanyLink["kind"], { icon: LucideIcon; pt: string; en: string }> = {
  site: { icon: Globe, pt: "Site institucional", en: "Company website" },
  instagram: { icon: Instagram, pt: "Instagram", en: "Instagram" },
  youtube: { icon: Youtube, pt: "YouTube", en: "YouTube" },
  tiktok: { icon: Music2, pt: "TikTok", en: "TikTok" },
  facebook: { icon: Facebook, pt: "Facebook", en: "Facebook" },
  linkedin: { icon: Linkedin, pt: "LinkedIn", en: "LinkedIn" },
  whatsapp: { icon: MessageCircle, pt: "WhatsApp", en: "WhatsApp" },
};

type RowLink = { key: string; icon: LucideIcon; label: string; href: string | null };

/** Produtos (plataforma, site, app na loja) e depois os canais do cliente. */
function rowLinks(company: Company, language: "pt" | "en"): RowLink[] {
  const pt = language === "pt";
  const products: RowLink[] = company.products.map((p) => {
    const store = storeOf(p.link);
    if (store) return { key: p.title, icon: Smartphone, label: storeCta(store, language), href: localizedStoreLink(p.link!, language) };
    const name =
      p.kind === "site" ? (pt ? "Site" : "Website") : p.title === company.name ? (pt ? "Plataforma" : "Platform") : p.title;
    return {
      key: p.title,
      icon: p.kind === "site" ? Globe : p.kind === "app" ? Smartphone : LayoutDashboard,
      label: p.link ? name : `${name}: ${pt ? "projeto privado" : "private project"}`,
      href: p.link,
    };
  });
  const channels: RowLink[] = (company.links ?? []).map((l) => ({
    key: l.url,
    icon: LINK_META[l.kind].icon,
    label: LINK_META[l.kind][language],
    href: l.url,
  }));
  return [...products, ...channels];
}

/** Coluna de links de um case (produto e canais do cliente). */
function LinksAside({ links, pt }: { links: RowLink[]; pt: boolean }) {
  if (links.length === 0) return null;
  return (
    <aside className="lg:col-span-4">
      <h4 className="text-base font-semibold">{pt ? "Links" : "Links"}</h4>
      <ul className="mt-3 border-t border-outline-variant">
        {links.map(({ key, icon: Icon, label, href }) => (
          <li key={key} className="border-b border-outline-variant">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex min-h-12 items-center gap-3 py-2 text-base transition-colors hover:text-on-surface"
              >
                <Icon size={18} className="shrink-0 text-on-surface-variant" />
                <span className="flex-1">{label}</span>
                <ArrowUpRight size={16} className="shrink-0 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </a>
            ) : (
              <span className="flex min-h-12 items-center gap-3 py-2 text-base text-on-surface-variant">
                <Lock size={16} className="shrink-0" />
                <span className="flex-1">{label}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

/**
 * Um case por cliente, sempre na mesma ordem (pedido do Vitor, 07/out/2026):
 * primeiro a imagem grande, no desktop e no celular; embaixo a história
 * (problema, o que a gente fez) e, à direita, os links do projeto e do
 * cliente. Link que não existe não aparece.
 *
 * `standalone`: a página própria do case (/cases/<id>), com o nome no h1 e
 * sem o link pra ela mesma. Na home é um item da lista.
 */
export function ProjectRow({
  company,
  pt,
  testimonials,
  standalone = false,
}: {
  company: Company;
  pt: boolean;
  testimonials: PublicTestimonial[];
  standalone?: boolean;
}) {
  const language = pt ? "pt" : "en";
  // Abre no primeiro produto com imagem: o case começa sempre pela imagem
  const [active, setActive] = useState(() =>
    Math.max(0, company.products.findIndex((p) => p.slug && PROJECT_SHOTS[p.slug])),
  );
  const product = company.products[active];
  const links = rowLinks(company, language);
  const Root = standalone ? "div" : "li";
  const Name = standalone ? "h1" : "h3";

  return (
    <Root
      id={standalone ? undefined : `case-${company.id}`}
      className={standalone ? "" : "scroll-mt-20 border-t border-outline-variant py-12 md:py-16"}
    >
      {company.products.length > 1 && (
        <div className="mb-4 inline-flex border border-outline-variant p-0.5">
          {company.products.map((p, i) => (
            <button
              key={p.title}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`h-10 px-4 text-sm font-medium transition-colors ${
                i === active ? "bg-on-surface text-surface" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {p.kind === "app" ? "App" : p.kind === "site" ? "Site" : pt ? "Plataforma" : "Platform"}
            </button>
          ))}
        </div>
      )}
      <div className="group -mx-5 sm:mx-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={product.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ClayMockup
              shots={product.slug ? PROJECT_SHOTS[product.slug] : undefined}
              label={`${company.name}: ${product.title}`}
              tallOnMobile
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Depoimentos do cliente por cima da base da imagem, acima do nome */}
      {testimonials.length > 0 && (
        <div className="relative z-10 -mt-10 sm:-mt-12 sm:px-6 md:-mt-16 md:px-10">
          <CaseTestimonials testimonials={testimonials} pt={pt} />
        </div>
      )}

      <div className="mt-8 grid gap-10 md:mt-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Name className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{company.name}</Name>
          <p className="mt-2 text-base text-on-surface-variant">
            {company.sector[language]} · {company.period}
          </p>
          {company.headline && (
            <p className="mt-6 text-balance text-2xl font-medium leading-snug tracking-[-0.025em] md:text-[1.75rem]">
              {company.headline[language]}
            </p>
          )}
          <dl className="mt-6 grid gap-6 text-base leading-relaxed md:grid-cols-2">
            <div>
              <dt className="font-semibold">{pt ? "O problema" : "The problem"}</dt>
              <dd className="mt-1 text-on-surface-variant">{(company.problem ?? company.about)[language]}</dd>
            </div>
            <div>
              <dt className="font-semibold">{pt ? "O que a gente fez" : "What we did"}</dt>
              <dd className="mt-1 text-on-surface-variant">{company.role[language]}</dd>
            </div>
            {company.result && (
              <div className="md:col-span-2">
                <dt className="font-semibold">{pt ? "Resultado" : "Result"}</dt>
                <dd className="mt-1 font-semibold">{company.result[language]}</dd>
              </div>
            )}
          </dl>

          {/* Quem termina de ler o case é quem mais quer um igual (21/out/2026) */}
          <div data-origem={`case-${company.id}`} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={whatsappCaseHref(pt, company.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-filled h-auto min-h-12 rounded-none px-6 py-3 text-base"
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle size={18} className="shrink-0" />
                {pt ? "Quero um projeto assim" : "I want a project like this"}
              </span>
            </a>
            <Link href="/orcamento" className="text-base font-medium underline underline-offset-4 hover:no-underline">
              {pt ? "Ou veja quanto custaria" : "Or see what it would cost"}
            </Link>
            {!standalone && (
              <Link
                href={`/cases/${company.id}`}
                className="text-base text-on-surface-variant underline underline-offset-4 hover:text-on-surface hover:no-underline"
              >
                {pt ? "Página do case" : "Case page"}
              </Link>
            )}
          </div>
        </div>

        <LinksAside links={links} pt={pt} />
      </div>
    </Root>
  );
}

/**
 * Projetos entregues: as linhas dos 4 clientes com contrato. Os outros
 * projetos saíram daqui em 21/out/2026 (pedido do Vitor: redundante e
 * informação demais); eles aparecem nos Serviços, ao abrir cada tipo.
 */
export default function HomeProjects({ testimonials }: { testimonials: PublicTestimonial[] }) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const section = HOME_SECTIONS.find((s) => s.id === "projetos")!;

  return (
    <Section id="projetos" aliases={section.aliases}>
      <SectionHeader
        title={pt ? "Projetos entregues" : "Delivered projects"}
        lead={
          pt
            ? "O problema de cada cliente e o que a gente fez. Tudo no ar e em uso."
            : "Each client's problem and what we did. All live and in use."
        }
      />

      <ol className="border-b border-outline-variant">
        {COMPANIES.map((company) => (
          <ProjectRow key={company.id} company={company} pt={pt} testimonials={caseTestimonials(testimonials, company.id)} />
        ))}
      </ol>
    </Section>
  );
}
