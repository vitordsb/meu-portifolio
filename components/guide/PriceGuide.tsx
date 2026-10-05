import Link from "next/link";
import { ArrowRight, Check, ScanSearch, Sparkles } from "lucide-react";
import PageHeader from "@/components/payments/PageHeader";
import { CNPJ } from "@/lib/email-layout";
import { PRICING } from "@/lib/estimate/pricing";
import { GUIDE_EXAMPLES } from "@/lib/guide/examples";

/**
 * Guia "Quanto custa um site ou aplicativo" (/quanto-custa). Conteúdo pra
 * busca do Google: renderizado no servidor, em português (é a busca do
 * público brasileiro). Valores saem de lib/guide/examples (mesma tabela do
 * orçamento com IA). Os links levam pro orçamento, Raio-X e pacotes; os
 * cliques são medidos pelo ClickTracker com origem "guia".
 */

const brl = (n: number) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

const byId = Object.fromEntries(GUIDE_EXAMPLES.map((e) => [e.id, e]));
const landing = byId.landing;
const site = byId.site;
const loja = byId.loja;
const app = byId.app;

export const GUIDE_UPDATED = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
}).format(new Date());

/** Resposta direta (topo da página e primeira pergunta do FAQ). */
export const GUIDE_ANSWER = `Uma landing page sai a partir de ${brl(landing.min)} e um site institucional a partir de ${brl(site.min)}. Loja virtual começa em ${brl(loja.min)} e aplicativo de celular em ${brl(app.min)}. O valor final depende do que o projeto precisa fazer, e a maior parte da diferença vem das funcionalidades.`;

const FACTORS: { title: string; text: string }[] = [
  {
    title: "Funcionalidades",
    text: "É o que mais pesa. Uma página que só apresenta a empresa é rápida; login, pagamento, agenda, chat e relatórios somam horas de trabalho cada um.",
  },
  {
    title: "Design",
    text: "Com layout pronto ou referências claras, o trabalho diminui. Criar a identidade da interface do zero leva mais tempo, e é onde um bom design mais faz diferença na venda.",
  },
  {
    title: "Integrações",
    text: "Pagamento online, cálculo de frete, WhatsApp, sistemas que a empresa já usa: cada conexão com um serviço externo precisa ser feita e testada.",
  },
  {
    title: "Site e aplicativo juntos",
    text: "Ter as duas versões custa mais que uma, mas bem menos que o dobro: boa parte do trabalho (regras, painel, servidor) é compartilhada.",
  },
  {
    title: "Prazo",
    text: "Prazo apertado custa mais, porque o projeto passa na frente de outros. Prazo flexível costuma sair mais barato.",
  },
];

const SAVE: string[] = [
  "Comece pela primeira versão (MVP): o essencial pra colocar a ideia no ar e validar com clientes reais. O resto entra depois, já com o que você aprendeu.",
  "Mande referências: prints de sites ou apps que você gosta e o que precisa ter. Menos idas e vindas, menos horas.",
  "Se não tem pressa, diga. Prazo flexível deixa o projeto mais barato.",
  "Pergunte pelas formas de pagamento: dá pra dividir em etapas, sem pagar tudo de uma vez.",
];

const COMPARE: { who: string; good: string; watch: string }[] = [
  {
    who: "Plataforma pronta (Wix, Shopify...)",
    good: "Mais barato pra começar e dá pra fazer sozinho.",
    watch:
      "Mensalidade pra sempre, visual parecido com o de todo mundo e limite quando o negócio cresce.",
  },
  {
    who: "Agência",
    good: "Equipe grande, processo formal, bom pra projetos muito grandes.",
    watch:
      "Preço bem mais alto (você paga a estrutura) e menos contato direto com quem faz.",
  },
  {
    who: "Profissional especialista",
    good: "Fala direto com quem faz, preço menor que agência e projeto sob medida.",
    watch: "Depende de quem você escolhe: peça portfólio, contrato e CNPJ.",
  },
];

export const GUIDE_FAQ: { q: string; a: string }[] = [
  { q: "Quanto custa um site em 2026?", a: GUIDE_ANSWER },
  {
    q: "Quanto custa um site simples?",
    a: `Uma landing page, com uma página só e botão de WhatsApp ou formulário, sai a partir de ${brl(landing.min)}. Um site institucional de até 5 páginas, a partir de ${brl(site.min)}.`,
  },
  {
    q: "Quanto custa um aplicativo?",
    a: `Um aplicativo para iPhone e Android com painel web de gestão começa em ${brl(app.min)} na primeira versão (MVP). Apps com muitas funcionalidades, como tempo real ou marketplace, custam mais.`,
  },
  {
    q: "Quanto tempo leva pra ficar pronto?",
    a: `Uma landing page fica pronta em ${landing.weeksMin} a ${landing.weeksMax} semanas e um site institucional em ${site.weeksMin} a ${site.weeksMax}. Loja virtual e aplicativo levam de ${loja.weeksMin} a ${app.weeksMax} semanas na primeira versão.`,
  },
  {
    q: "Dá pra parcelar?",
    a: `Sim. O padrão é metade na aprovação e metade na entrega. A partir de ${brl(PRICING.payment.installmentsFrom)}, também dá pra pagar em 3x no boleto sem acréscimo ou em etapas por contrato.`,
  },
  {
    q: "O que é MVP e por que começar por ele?",
    a: "MVP é a primeira versão do projeto, só com o essencial pra funcionar e ser testado por clientes reais. Custa menos, fica pronto antes e evita gastar com funcionalidades que ninguém vai usar.",
  },
  {
    q: "Tem custo depois que o site fica pronto?",
    a: "Sim, mas baixo: o domínio .com.br custa cerca de R$ 40 por ano no Registro.br, e a hospedagem de um site simples pode ser gratuita ou de poucos reais por mês. Sistemas e apps têm custo de servidor proporcional ao uso.",
  },
];

const card = "rounded-2xl border border-outline-variant bg-surface-low p-6";
const label =
  "font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant";

export default function PriceGuide() {
  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <PageHeader />

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-10 sm:pt-14 [@media(max-height:500px)]:pt-6">
        {/* ── Resposta direta ─────────────────────────────────────────── */}
        <p className={label}>Guia de preços · atualizado em {GUIDE_UPDATED}</p>
        <h1 className="mt-3 max-w-3xl text-[clamp(2rem,6vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
          Quanto custa um site ou aplicativo em 2026?
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
          {GUIDE_ANSWER}
        </p>
        <div
          data-origem="guia-topo"
          className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <Link
            href="/orcamento"
            className="btn btn-filled h-12 rounded-lg px-6 text-base"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles size={16} />
              Calcular o valor do meu projeto
            </span>
          </Link>
          <span className="text-sm text-on-surface-variant">
            Orçamento com IA em 2 minutos, sem compromisso.
          </span>
        </div>

        {/* ── Tabela de valores ───────────────────────────────────────── */}
        <section className="mt-16" aria-labelledby="valores">
          <h2
            id="valores"
            className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl"
          >
            Quanto custa cada tipo de projeto
          </h2>
          <p className="mt-2 max-w-2xl text-on-surface-variant">
            Valores de partida da primeira versão, com os critérios que eu uso
            nos meus projetos. O valor fechado sai depois de entender o seu
            escopo.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {GUIDE_EXAMPLES.map((e) => (
              <li key={e.id} className={`${card} flex flex-col`}>
                <h3 className="text-xl font-extrabold tracking-[-0.02em]">
                  {e.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                  {e.forWho}
                </p>
                <p className="mt-5 text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
                  {brl(e.min)}
                  <span className="text-on-surface-variant"> a </span>
                  {brl(e.max)}
                </p>
                <p className="mt-1.5 text-sm text-on-surface-variant">
                  Prazo: {e.weeksMin} a {e.weeksMax} semanas
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  {e.includes.map((it) => (
                    <li key={it} className="flex gap-2.5">
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-on-surface-variant"
                      />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li
              data-origem="guia-tabela"
              className="flex flex-col justify-between rounded-2xl bg-on-surface p-6 text-surface"
            >
              <div>
                <h3 className="text-xl font-extrabold tracking-[-0.02em]">
                  O seu projeto
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed opacity-80">
                  Não se encaixa em nenhum? Conta a ideia pra assistente e
                  receba o valor de partida e o prazo na hora.
                </p>
              </div>
              <Link
                href="/orcamento"
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-surface px-5 font-semibold text-on-surface"
              >
                Calcular agora <ArrowRight size={16} />
              </Link>
            </li>
          </ul>
        </section>

        {/* ── O que muda o preço ──────────────────────────────────────── */}
        <section
          className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]"
          aria-labelledby="fatores"
        >
          <div>
            <h2
              id="fatores"
              className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl"
            >
              O que faz o preço subir ou descer
            </h2>
            <dl className="mt-6 space-y-5">
              {FACTORS.map((f) => (
                <div key={f.title}>
                  <dt className="font-semibold">{f.title}</dt>
                  <dd className="mt-1 leading-relaxed text-on-surface-variant">
                    {f.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className={`${card} self-start`}>
            <h2 className="text-xl font-extrabold tracking-[-0.02em]">
              Como pagar menos sem perder qualidade
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              {SAVE.map((s) => (
                <li key={s} className="flex gap-2.5">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-on-surface-variant"
                  />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Quem contratar ──────────────────────────────────────────── */}
        <section className="mt-16" aria-labelledby="quem">
          <h2
            id="quem"
            className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl"
          >
            Plataforma pronta, agência ou profissional?
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {COMPARE.map((c) => (
              <div key={c.who} className={card}>
                <h3 className="text-base font-semibold leading-snug">
                  {c.who}
                </h3>
                <p className="mt-3 text-sm leading-relaxed">
                  <span className="font-medium">Bom: </span>
                  <span className="text-on-surface-variant">{c.good}</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed">
                  <span className="font-medium">Atenção: </span>
                  <span className="text-on-surface-variant">{c.watch}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-on-surface-variant">
            Eu trabalho como profissional especialista: contrato, CNPJ {CNPJ},
            pagamento em etapas e contato direto comigo do começo ao fim.
          </p>
        </section>

        {/* ── Já tem site ─────────────────────────────────────────────── */}
        <section
          data-origem="guia-raiox"
          className={`${card} mt-16 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="max-w-xl">
            <h2 className="text-xl font-extrabold tracking-[-0.02em]">
              Já tem um site?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
              Antes de fazer outro, veja o que o atual está fazendo de errado. O
              Raio-X grátis mostra em meio minuto o que afasta clientes no
              celular.
            </p>
          </div>
          <Link
            href="/raio-x"
            className="btn btn-outlined h-12 shrink-0 rounded-lg px-5 text-base"
          >
            <span className="inline-flex items-center gap-2">
              <ScanSearch size={16} />
              Fazer o Raio-X grátis
            </span>
          </Link>
        </section>

        {/* ── Perguntas frequentes ────────────────────────────────────── */}
        <section className="mt-16" aria-labelledby="faq">
          <h2
            id="faq"
            className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl"
          >
            Perguntas frequentes
          </h2>
          <div className="mt-6 divide-y divide-outline-variant border-y border-outline-variant">
            {GUIDE_FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="text-xl leading-none text-on-surface-variant transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl leading-relaxed text-on-surface-variant">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Fechamento ──────────────────────────────────────────────── */}
        <section
          data-origem="guia-fim"
          className="mt-16 rounded-2xl bg-on-surface p-7 text-surface sm:p-10"
        >
          <h2 className="max-w-2xl text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
            Quer saber quanto fica o seu?
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed opacity-80">
            Conta a ideia em 2 minutos e receba o valor de partida e o prazo. Se
            preferir algo pronto, os pacotes têm preço fechado.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/orcamento"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-surface px-6 font-semibold text-on-surface"
            >
              <Sparkles size={16} /> Orçamento com IA
            </Link>
            <Link
              href="/servicos"
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-surface/30 px-6 font-semibold"
            >
              Ver pacotes com preço fechado
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
