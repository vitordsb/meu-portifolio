import Link from "next/link";
import { ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react";
import PageHeader from "@/components/payments/PageHeader";
import ProjectTile from "@/components/home/ProjectTile";
import { CNPJ } from "@/lib/email-layout";
import { whatsappHref } from "@/lib/home-links";
import type { ServicePageData } from "@/lib/service-pages-data";

/**
 * Página de um serviço (/servicos/<slug>), renderizada no servidor e em
 * português, como o guia /quanto-custa. Conteúdo em lib/service-pages.
 * Cliques medidos pelo ClickTracker com origem "servico-<tipo>-...".
 */

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const card = "border border-outline-variant bg-surface-low p-6";

/** Perguntas da página: preço e prazo do serviço, e as respostas das Dúvidas da home. */
export function serviceFaq(d: ServicePageData): { q: string; a: string }[] {
  const g = d.guide;
  return [
    {
      q: `Quanto custa ${d.noun}?`,
      a: `A partir de ${brl(g.min)}, com projetos mais completos chegando a ${brl(g.max)}. O valor fechado depende do que o projeto precisa fazer e sai depois de entender o seu escopo. O orçamento guiado mostra a faixa do seu em 2 minutos.`,
    },
    {
      q: "Quanto tempo leva?",
      a: `De ${g.weeksMin} a ${g.weeksMax} semanas na maior parte dos casos. O prazo do seu projeto vem por escrito na proposta.`,
    },
    // Mesmo texto das Dúvidas da home (components/home/HomeFaq): mudar lá, mudar aqui
    {
      q: "Preciso entender de tecnologia?",
      a: "Não. Você explica o que precisa com as suas palavras e recebe as telas desenhadas pra aprovar antes da programação.",
    },
    {
      q: "Tem contrato e nota fiscal?",
      a: `Sim. A empresa tem CNPJ ativo (${CNPJ}) e o projeto tem contrato e nota fiscal.`,
    },
    {
      q: "E se não ficar como o combinado?",
      a: "A gente ajusta sem custo extra. O que vale é o escopo escrito na proposta: se a entrega não bate com ele, a correção é por nossa conta.",
    },
  ];
}

export default function ServiceTypePage({ data: d }: { data: ServicePageData }) {
  const g = d.guide;
  const origem = `servico-${d.type}`;

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <PageHeader />

      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        <h1 className="max-w-3xl text-[clamp(2rem,6vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
          {d.name}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-on-surface-variant">{d.lead}</p>
        <div data-origem={`${origem}-topo`} className="mt-7 flex flex-wrap items-center gap-3">
          <Link href="/orcamento" className="btn btn-filled h-auto min-h-12 rounded-none px-6 py-3 text-base">
            <span className="inline-flex items-center gap-2">
              <Sparkles size={16} />
              Calcular o valor do meu projeto
            </span>
          </Link>
          <a
            href={whatsappHref(true)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outlined h-auto min-h-12 rounded-none px-6 py-3 text-base"
          >
            <span className="inline-flex items-center gap-2">
              <MessageCircle size={16} />
              Falar no WhatsApp
            </span>
          </a>
        </div>
        <p className="mt-3 text-sm text-on-surface-variant">
          A gente responde no WhatsApp em até 1 hora, em horário comercial.
        </p>

        {/* ── Pra quem é + preço ───────────────────────────────────────── */}
        <section className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]" aria-labelledby="pra-quem">
          <div>
            <h2 id="pra-quem" className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
              É pra você se
            </h2>
            <ul className="mt-6 space-y-4 text-lg leading-relaxed">
              {d.signs.map((s) => (
                <li key={s} className="flex gap-3">
                  <Check size={20} className="mt-1 shrink-0 text-on-surface-variant" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${card} self-start`}>
            <p className="text-sm font-semibold text-on-surface-variant">Quanto custa</p>
            <p className="mt-2 text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
              a partir de {brl(g.min)}
            </p>
            <p className="mt-1.5 text-sm text-on-surface-variant">
              Prazo: {g.weeksMin} a {g.weeksMax} semanas
            </p>
            <p className="mt-5 text-sm font-semibold">O que vem</p>
            <ul className="mt-2 space-y-2 text-sm">
              {g.includes.map((it) => (
                <li key={it} className="flex gap-2.5">
                  <Check size={16} className="mt-0.5 shrink-0 text-on-surface-variant" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <div data-origem={`${origem}-preco`} className="mt-6 flex flex-col gap-3">
              {d.pkg && (
                <Link href="/servicos" className="btn btn-filled h-12 rounded-none px-5 text-base">
                  Contratar por {brl(d.pkg.price)}
                </Link>
              )}
              <Link
                href="/quanto-custa"
                className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4 hover:no-underline"
              >
                Ver o que muda o preço <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Projetos entregues ──────────────────────────────────────── */}
        {d.projects.length > 0 && (
          <section className="mt-20" aria-labelledby="projetos">
            <h2 id="projetos" className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
              Projetos entregues ({d.projects.length})
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {d.projects.map((p) => (
                <div key={p.slug}>
                  <ProjectTile project={p} pt compact />
                  {p.caseId && (
                    <Link
                      href={`/cases/${p.caseId}`}
                      className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline underline-offset-4 hover:no-underline"
                    >
                      Ver o case completo <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Perguntas ───────────────────────────────────────────── */}
        <section className="mt-20 max-w-3xl" aria-labelledby="duvidas">
          <h2 id="duvidas" className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
            Perguntas frequentes
          </h2>
          <dl className="mt-6 divide-y divide-outline-variant border-y border-outline-variant">
            {serviceFaq(d).map((f) => (
              <div key={f.q} className="py-5">
                <dt className="text-lg font-semibold">{f.q}</dt>
                <dd className="mt-1.5 leading-relaxed text-on-surface-variant">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          data-origem={`${origem}-fim`}
          className="mt-16 flex flex-col gap-5 bg-on-surface p-6 text-surface sm:p-10 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em]">Vamos conversar sobre o seu?</h2>
            <p className="mt-1.5 opacity-80">Conta a ideia e receba o valor de partida e o prazo na hora.</p>
          </div>
          <Link
            href="/orcamento"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-none bg-surface px-6 font-semibold text-on-surface"
          >
            Calcular agora <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  );
}
