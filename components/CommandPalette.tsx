"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import {
  ArrowUpRight,
  AtSign,
  Award,
  Briefcase,
  Code2,
  CornerDownLeft,
  FileText,
  Folder,
  GraduationCap,
  Home,
  Languages,
  Layers,
  MessageCircle,
  Route,
  Search,
  Sparkles,
  SunMoon,
  User,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useContactModal } from "@/contexts/ContactModalContext";
import { scoreItem } from "@/lib/search";
import {
  SEARCH_INTENTS,
  type SearchAction,
  type SearchIntent,
} from "@/lib/search-intents";
import { SEARCH_INDEX } from "@/lib/search-index";
import { GithubIcon, LinkedinIcon } from "@/components/deck/SocialIcons";

const ICONS: Record<SearchIntent["icon"], LucideIcon | typeof GithubIcon> = {
  folder: Folder,
  sparkles: Sparkles,
  layers: Layers,
  route: Route,
  award: Award,
  home: Home,
  code: Code2,
  briefcase: Briefcase,
  graduation: GraduationCap,
  message: MessageCircle,
  mail: AtSign,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  file: FileText,
  theme: SunMoon,
  language: Languages,
  user: User,
};

const GROUP_LABELS: Record<string, { pt: string; en: string }> = {
  navegar: { pt: "Navegar", en: "Navigate" },
  falar: { pt: "Falar comigo", en: "Get in touch" },
  preferencias: { pt: "Preferências", en: "Preferences" },
  projetos: { pt: "Projetos", en: "Projects" },
  skills: { pt: "Tecnologias", en: "Stack" },
  cursos: { pt: "Cursos", en: "Courses" },
};

const item =
  "group flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm outline-none " +
  "data-[selected=true]:bg-surface-high";
const heading =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 " +
  "[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase " +
  "[&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-on-surface-variant";

/**
 * Busca estilo Spotlight (ctrl + espaço ou ⌘K). Mistura o vocabulário fixo de
 * `search-intents` com os dados do banco, e o ranking de `lib/search` faz o
 * resto: sinônimo, acento, erro de digitação e frase inteira.
 */
export default function CommandPalette({
  open,
  onOpenChange,
  isMac,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMac: boolean;
}) {
  const { language, setLanguage } = useLanguage();
  const { cycleTheme } = useTheme();
  const { open: openContact } = useContactModal();
  const router = useRouter();
  const pathname = usePathname();
  const pt = language === "pt";

  const [search, setSearch] = useState("");
  const data = SEARCH_INDEX;

  // Limpa a busca depois que o fechamento terminou de animar
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setSearch(""), 200);
    return () => clearTimeout(t);
  }, [open]);

  const run = (action: SearchAction) => {
    onOpenChange(false);
    switch (action.kind) {
      case "section": {
        if (pathname === "/") {
          // O deck escuta o hashchange e troca de sessão
          window.location.hash =
            action.anchor ?? (action.id === "inicio" ? "" : action.id);
        } else {
          const target = action.anchor ?? action.id;
          router.push(target === "inicio" ? "/" : `/#${target}`);
        }
        break;
      }
      case "route":
        router.push(action.href);
        break;
      case "link":
        window.open(action.href, "_blank", "noopener,noreferrer");
        break;
      case "contact":
        // Espera a paleta sair pra os dois diálogos não brigarem pelo foco
        setTimeout(() => openContact(action.subject?.[language]), 150);
        break;
      case "theme":
        cycleTheme();
        break;
      case "language":
        setLanguage(pt ? "en" : "pt");
        break;
    }
  };

  const groups = useMemo(() => {
    const order: SearchIntent["group"][] = ["navegar", "falar", "preferencias"];
    return order.map((g) => ({
      key: g,
      intents: SEARCH_INTENTS.filter((i) => i.group === g),
    }));
  }, []);

  const searching = search.trim().length > 0;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[95] bg-scrim/20 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[12vh] z-[96] w-[min(38rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-outline-variant bg-surface text-on-surface elev-5 focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-[0.98]"
        >
          <Dialog.Title className="sr-only">
            {pt ? "Buscar no portfólio" : "Search the portfolio"}
          </Dialog.Title>

          <Command
            loop
            label={pt ? "Buscar no portfólio" : "Search the portfolio"}
            filter={(_value, query, keywords) =>
              scoreItem(query, keywords ?? [])
            }
          >
            <div className="flex items-center gap-3 border-b border-outline-variant px-4">
              <Search size={18} className="shrink-0 text-on-surface-variant" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder={
                  pt
                    ? "Pergunte ou pesquise: projetos, react, orçamento..."
                    : "Ask or search: projects, react, pricing..."
                }
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-on-surface-variant/60"
              />
              <kbd className="hidden shrink-0 rounded border border-outline-variant px-1.5 py-0.5 font-mono text-[10px] text-on-surface-variant sm:block">
                esc
              </kbd>
            </div>

            <Command.List
              className={`max-h-[min(26rem,55vh)] overflow-y-auto overscroll-contain p-1.5 ${heading}`}
            >
              <Command.Empty className="px-3 py-10 text-center text-sm text-on-surface-variant">
                {pt
                  ? "Não achei nada com isso. Tente “projetos”, “contato” ou “react”."
                  : "Nothing found. Try “projects”, “contact” or “react”."}
              </Command.Empty>

              {groups.map(({ key, intents }) => (
                <Command.Group key={key} heading={GROUP_LABELS[key][language]}>
                  {intents.map((intent) => {
                    const Icon = ICONS[intent.icon];
                    const label = intent.label[language];
                    return (
                      <Command.Item
                        key={intent.id}
                        value={intent.id}
                        keywords={[label, ...intent.keywords]}
                        onSelect={() => run(intent.action)}
                        className={item}
                      >
                        <Icon
                          size={16}
                          className="shrink-0 text-on-surface-variant"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{label}</span>
                          {searching && (
                            <span className="block truncate text-xs text-on-surface-variant">
                              {intent.answer[language]}
                            </span>
                          )}
                        </span>
                        {intent.action.kind === "link" ? (
                          <ArrowUpRight
                            size={14}
                            className="shrink-0 text-on-surface-variant"
                          />
                        ) : (
                          <CornerDownLeft
                            size={14}
                            className="shrink-0 text-on-surface-variant opacity-0 group-data-[selected=true]:opacity-100"
                          />
                        )}
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              ))}

              {/* Dados do banco só entram quando há busca: a lista inicial fica curta */}
              {searching && data && (
                <>
                  <Command.Group heading={GROUP_LABELS.projetos[language]}>
                    {data.projects.map((p) => (
                      <Command.Item
                        key={`p-${p.id}`}
                        value={`p-${p.id}`}
                        keywords={[
                          p.title,
                          p.company,
                          p.category,
                          ...p.tags,
                          "projeto",
                          "project",
                        ]}
                        onSelect={() =>
                          run(
                            p.link
                              ? { kind: "link", href: p.link }
                              : { kind: "section", id: "experiencia" },
                          )
                        }
                        className={item}
                      >
                        <Folder
                          size={16}
                          className="shrink-0 text-on-surface-variant"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{p.title}</span>
                          <span className="block truncate text-xs text-on-surface-variant">
                            {p.company} · {p.category}
                          </span>
                        </span>
                        {p.link && (
                          <ArrowUpRight
                            size={14}
                            className="shrink-0 text-on-surface-variant"
                          />
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Group heading={GROUP_LABELS.skills[language]}>
                    {data.skills.map((s) => (
                      <Command.Item
                        key={`s-${s.id}`}
                        value={`s-${s.id}`}
                        keywords={[s.title, s.category]}
                        onSelect={() =>
                          run({
                            kind: "section",
                            id: "especializacoes",
                            anchor: "tecnologias",
                          })
                        }
                        className={item}
                      >
                        <Layers
                          size={16}
                          className="shrink-0 text-on-surface-variant"
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {s.title}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-on-surface-variant">
                          {s.category}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Group heading={GROUP_LABELS.cursos[language]}>
                    {data.certificates.map((c) => (
                      <Command.Item
                        key={`c-${c.id}`}
                        value={`c-${c.id}`}
                        keywords={[
                          c.name,
                          c.category,
                          ...c.tags,
                          "curso",
                          "course",
                        ]}
                        onSelect={() =>
                          run(
                            c.link
                              ? { kind: "link", href: c.link }
                              : { kind: "route", href: "/certificates" },
                          )
                        }
                        className={item}
                      >
                        <Award
                          size={16}
                          className="shrink-0 text-on-surface-variant"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{c.name}</span>
                          <span className="block truncate text-xs text-on-surface-variant">
                            {c.category}
                          </span>
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                </>
              )}
            </Command.List>

            <div className="hidden items-center gap-4 border-t border-outline-variant px-4 py-2 font-mono text-[10px] text-on-surface-variant sm:flex">
              <span>↑↓ {pt ? "navegar" : "navigate"}</span>
              <span>enter {pt ? "abrir" : "open"}</span>
              <span className="ml-auto">
                {isMac ? "⌘K" : `ctrl + ${pt ? "espaço" : "space"} · ctrl K`}
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
