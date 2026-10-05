"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Globe, Loader2, RotateCcw, ScanSearch } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import { SOCIALS } from "@/lib/deck-content";
import { PACKAGES } from "@/lib/payments/packages";
import { raioXWhatsappText } from "@/lib/raio-x/shared";
import type { Category, Impact, Issue, Report } from "@/lib/raio-x/types";
import { displayUrl, normalizeSiteUrl } from "@/lib/raio-x/url";
import { WhatsappIcon } from "@/components/deck/SocialIcons";
import PageHeader from "@/components/payments/PageHeader";
import LeadGate, { type RaioXLead } from "./LeadGate";
import ScoreRing from "./ScoreRing";

/**
 * Raio-X grátis do site: a pessoa cola o endereço, o Google roda o
 * Lighthouse simulando um celular e a página mostra notas e os 3 problemas
 * mais graves sem cadastro. O relatório completo (todos os pontos com o
 * "como resolver") abre com nome e WhatsApp: é o lead.
 *
 * Quem tem site ruim é exatamente o cliente de site novo, então o fim do
 * relatório oferece o pacote que resolve.
 */

const STORAGE_KEY = "raiox:v1";
const FREE_ISSUES = 3;
const WIDTH = "max-w-3xl";

type Saved = { report: Report; unlocked: boolean; code: string | null; name: string };

type Phase =
  | { kind: "idle" }
  | { kind: "loading"; url: string }
  | { kind: "error"; message: string };

const CAT_LABEL: Record<Category, { pt: string; en: string }> = {
  performance: { pt: "Velocidade", en: "Speed" },
  seo: { pt: "Google", en: "Google" },
  accessibility: { pt: "Acessibilidade", en: "Accessibility" },
  bestPractices: { pt: "Segurança", en: "Security" },
};

const IMPACT_LABEL: Record<Impact, { pt: string; en: string; tone: string }> = {
  alto: {
    pt: "Urgente",
    en: "Urgent",
    tone: "bg-red-600/10 text-red-700 dark:text-red-300",
  },
  medio: {
    pt: "Importante",
    en: "Important",
    tone: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  },
  baixo: {
    pt: "Simples",
    en: "Simple",
    tone: "bg-on-surface/[0.06] text-on-surface-variant",
  },
};

const STEPS = {
  pt: [
    "Abrindo seu site num celular",
    "Medindo quanto tempo leva pra aparecer",
    "Conferindo o que o Google enxerga",
    "Testando leitura e toque",
    "Montando o relatório",
  ],
  en: [
    "Opening your site on a phone",
    "Timing how long it takes to show up",
    "Checking what Google sees",
    "Testing readability and taps",
    "Putting the report together",
  ],
};

function errorMessage(code: string, pt: boolean, retryMin?: number) {
  const m: Record<string, [string, string]> = {
    url: [
      "Esse endereço não parece um site. Confere e tenta de novo (ex.: suaempresa.com.br).",
      "That doesn't look like a website. Check it and try again (e.g. yourcompany.com).",
    ],
    inacessivel: [
      "Não consegui abrir esse site. Confere o endereço e se ele está no ar.",
      "I couldn't open that site. Check the address and whether it's online.",
    ],
    demorou: [
      "O site demorou demais pra responder ao teste. Isso já é um sinal: quase ninguém espera tanto. Tenta de novo em instantes.",
      "The site took too long to respond. That's already a red flag: almost nobody waits that long. Try again shortly.",
    ],
    ocupado: [
      "Muita gente usando o Raio-X agora. Tenta de novo em 1 minuto.",
      "Lots of people are using it right now. Try again in a minute.",
    ],
    unavailable: [
      "Muita gente usando o Raio-X agora. Tenta de novo em 1 minuto.",
      "Lots of people are using it right now. Try again in a minute.",
    ],
    rate_limited: [
      `Você fez várias análises seguidas. Tenta de novo em ${retryMin ?? 10} min.`,
      `You ran several checks in a row. Try again in ${retryMin ?? 10} min.`,
    ],
    sem_chave: [
      "O Raio-X está em manutenção. Me chama no WhatsApp que eu analiso o seu site.",
      "The site check is under maintenance. Message me on WhatsApp and I'll check your site.",
    ],
    offline: [
      "Sem conexão. Confere a internet e tenta de novo.",
      "No connection. Check your internet and try again.",
    ],
  };
  const pair = m[code] ?? [
    "Não deu certo agora. Tenta de novo, ou me chama no WhatsApp.",
    "Something went wrong. Try again, or message me on WhatsApp.",
  ];
  return pt ? pair[0] : pair[1];
}

function seconds(ms: number, pt: boolean) {
  return `${(ms / 1000).toLocaleString(pt ? "pt-BR" : "en-US", { maximumFractionDigits: 1 })} s`;
}

/** Site precisa de refação (oferece site novo) ou de ajustes (oferece revisão)? */
function needsRebuild(r: Report) {
  const urgent = r.issues.filter((i) => i.impact === "alto").length;
  return r.scores.performance < 50 || urgent >= 3 || r.metrics.lcpMs > 6000;
}

export default function RaioXPage() {
  const { language } = useLanguage();
  const pt = language === "pt";
  const lang = pt ? "pt" : "en";
  const reduce = useReducedMotion();

  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [saved, setSaved] = useState<Saved | null>(null);
  const [leadBusy, setLeadBusy] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Relatório volta se a pessoa recarregar ou for e voltar
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw) as Saved);
    } catch {}
  }, []);

  const persist = (s: Saved | null) => {
    setSaved(s);
    try {
      if (s) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase.kind === "loading") return;
    const url = normalizeSiteUrl(input);
    if (!url) {
      setPhase({ kind: "error", message: errorMessage("url", pt) });
      return;
    }
    setPhase({ kind: "loading", url });
    persist(null);
    trackEvent("raiox_inicio");
    try {
      const res = await fetch("/api/raio-x/analisar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.report) {
        const report = data.report as Report;
        persist({ report, unlocked: false, code: null, name: "" });
        setPhase({ kind: "idle" });
        trackEvent("raiox_resultado", {
          velocidade: report.scores.performance,
          problemas: report.issues.length,
        });
        requestAnimationFrame(() =>
          resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }),
        );
        return;
      }
      const code = typeof data.error === "string" ? data.error : "falhou";
      trackEvent("raiox_erro", { motivo: code });
      setPhase({ kind: "error", message: errorMessage(code, pt, data.retryAfterMin) });
    } catch {
      setPhase({ kind: "error", message: errorMessage("offline", pt) });
    }
  };

  const unlock = async (lead: RaioXLead) => {
    if (!saved) return;
    setLeadBusy(true);
    setLeadError(null);
    const r = saved.report;
    try {
      const res = await fetch("/api/raio-x/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origem: readAttribution(),
          name: lead.name,
          whatsapp: lead.whatsapp,
          email: lead.email.trim() || undefined,
          consent: true,
          lang,
          url: r.url,
          scores: r.scores,
          lcpMs: r.metrics.lcpMs,
          issues: r.issues.map((i) => ({ id: i.id, impact: i.impact })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.code) {
        trackEvent("raiox_lead", { email: Boolean(lead.email.trim()) });
        persist({ ...saved, unlocked: true, code: data.code, name: lead.name.trim() });
        return;
      }
      setLeadError(
        res.status === 429
          ? errorMessage("rate_limited", pt, data.retryAfterMin)
          : res.status === 400
            ? pt
              ? "Confere o nome e o WhatsApp (com DDD)."
              : "Check your name and WhatsApp (with area code)."
            : errorMessage("falhou", pt),
      );
    } catch {
      setLeadError(errorMessage("offline", pt));
    } finally {
      setLeadBusy(false);
    }
  };

  const restart = () => {
    persist(null);
    setInput("");
    setPhase({ kind: "idle" });
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const loading = phase.kind === "loading";

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <PageHeader width={WIDTH} />

      <main className={`mx-auto w-full ${WIDTH} px-4 pb-24 pt-10 sm:pt-16 [@media(max-height:500px)]:pt-6`}>
        <h1 className="text-[clamp(2rem,7vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
          {pt ? "Raio-X grátis do seu site" : "Free website check"}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-on-surface-variant">
          {pt
            ? "Cole o endereço e veja em meio minuto o que está afastando clientes no celular: velocidade, Google e acessibilidade."
            : "Paste the address and see in half a minute what's pushing customers away on mobile: speed, Google and accessibility."}
        </p>

        <form onSubmit={analyze} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label className="flex h-14 w-full items-center gap-3 rounded-xl sm:flex-1 border border-outline-variant bg-surface px-4 transition focus-within:border-on-surface focus-within:ring-2 focus-within:ring-on-surface/10">
            <Globe size={18} className="shrink-0 text-on-surface-variant" />
            <span className="sr-only">{pt ? "Endereço do site" : "Website address"}</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={pt ? "suaempresa.com.br" : "yourcompany.com"}
              inputMode="url"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              maxLength={200}
              disabled={loading}
              className="h-full w-full min-w-0 bg-transparent text-base outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn btn-filled h-14 shrink-0 rounded-xl px-6 text-base"
          >
            <span className="inline-flex items-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ScanSearch size={18} />}
              {loading ? (pt ? "Analisando..." : "Checking...") : pt ? "Analisar grátis" : "Check for free"}
            </span>
          </button>
        </form>
        <p className="mt-3 text-sm text-on-surface-variant">
          {pt
            ? "Usa o mesmo teste do Google (Lighthouse). As notas aparecem sem cadastro."
            : "Uses Google's own test (Lighthouse). Scores show up without signing up."}
        </p>

        {phase.kind === "error" && (
          <p role="alert" className="mt-5 rounded-xl border border-outline-variant bg-surface-low p-4 text-sm leading-relaxed">
            {phase.message}
          </p>
        )}

        {loading && <Analyzing pt={pt} url={phase.url} />}

        {saved && !loading && (
          <div ref={resultRef} className="scroll-mt-6">
            <Result
              pt={pt}
              saved={saved}
              leadBusy={leadBusy}
              leadError={leadError}
              onUnlock={unlock}
              onRestart={restart}
            />
          </div>
        )}
      </main>
    </div>
  );
}

// ── Carregando ──────────────────────────────────────────────────────────────

function Analyzing({ pt, url }: { pt: boolean; url: string }) {
  const steps = STEPS[pt ? "pt" : "en"];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 6500);
    return () => clearInterval(t);
  }, [steps.length]);

  return (
    <div role="status" aria-live="polite" className="mt-10 rounded-2xl border border-outline-variant p-5 sm:p-6">
      <p className="truncate font-mono text-xs text-on-surface-variant">{displayUrl(url)}</p>
      <p className="mt-2 text-lg font-semibold">{steps[step]}...</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-on-surface/[0.08]">
        {/* Tempo real é de 10 a 40 s: a barra anda rápido no começo e segura
            perto do fim, sem prometer um número que o Google não garante */}
        <motion.div
          className="h-full rounded-full bg-on-surface"
          initial={{ width: "4%" }}
          animate={{ width: "92%" }}
          transition={{ duration: 38, ease: [0.1, 0.7, 0.3, 1] }}
        />
      </div>
      <p className="mt-3 text-sm text-on-surface-variant">
        {pt ? "Leva uns 30 segundos. Pode deixar a página aberta." : "Takes about 30 seconds. Keep the page open."}
      </p>
    </div>
  );
}

// ── Resultado ───────────────────────────────────────────────────────────────

function IssueCard({ issue, pt, showFix }: { issue: Issue; pt: boolean; showFix: boolean }) {
  const imp = IMPACT_LABEL[issue.impact];
  return (
    <li className="rounded-xl border border-outline-variant p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] ${imp.tone}`}>
          {pt ? imp.pt : imp.en}
        </span>
        <span className="text-xs text-on-surface-variant">{CAT_LABEL[issue.cat][pt ? "pt" : "en"]}</span>
      </div>
      <p className="mt-2 font-semibold leading-snug">{issue.title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">{issue.why}</p>
      {showFix && (
        <p className="mt-2 text-sm leading-relaxed">
          <span className="font-semibold">{pt ? "Como resolver: " : "How to fix: "}</span>
          {issue.fix}
        </p>
      )}
    </li>
  );
}

function Result({
  pt,
  saved,
  leadBusy,
  leadError,
  onUnlock,
  onRestart,
}: {
  pt: boolean;
  saved: Saved;
  leadBusy: boolean;
  leadError: string | null;
  onUnlock: (lead: RaioXLead) => void;
  onRestart: () => void;
}) {
  const { report: r, unlocked, code, name } = saved;
  const lang = pt ? "pt" : "en";
  const urgent = r.issues.filter((i) => i.impact === "alto").length;
  const visible = unlocked ? r.issues : r.issues.slice(0, FREE_ISSUES);
  const locked = unlocked ? 0 : Math.max(0, r.issues.length - FREE_ISSUES);
  const slow = r.metrics.lcpMs > 2500;

  const headline = slow
    ? pt
      ? `Seu site leva ${seconds(r.metrics.lcpMs, pt)} pra aparecer no celular.`
      : `Your site takes ${seconds(r.metrics.lcpMs, pt)} to show up on phones.`
    : pt
      ? "Seu site abre rápido no celular."
      : "Your site loads fast on phones.";

  const summary = r.issues.length
    ? pt
      ? `Encontrei ${r.issues.length} ${r.issues.length === 1 ? "ponto" : "pontos"} pra melhorar${urgent ? `, ${urgent} ${urgent === 1 ? "urgente" : "urgentes"}` : ""}.`
      : `I found ${r.issues.length} ${r.issues.length === 1 ? "thing" : "things"} to improve${urgent ? `, ${urgent} urgent` : ""}.`
    : pt
      ? "Não encontrei nada grave. Seu site está em boa forma."
      : "Nothing serious found. Your site is in good shape.";

  return (
    <section className="mt-12 border-t border-outline-variant pt-10">
      <div className="grid items-start gap-6 sm:grid-cols-[9.5rem_1fr] sm:gap-8">
        {r.screenshot ? (
          <div className="mx-auto w-32 overflow-hidden rounded-[1.4rem] border-[5px] border-on-surface/90 bg-on-surface/90 shadow-lg sm:mx-0 sm:w-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URL do Google, sem otimização a fazer */}
            <img src={r.screenshot} alt={pt ? "Seu site no celular" : "Your site on a phone"} className="block w-full rounded-[1rem]" />
          </div>
        ) : (
          <div className="hidden sm:block" />
        )}
        <div className="min-w-0">
          <p className="truncate font-mono text-xs text-on-surface-variant">{displayUrl(r.url)}</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.02em] sm:text-3xl">{headline}</h2>
          <p className="mt-2 text-on-surface-variant">{summary}</p>
          <div className="mt-6 grid grid-cols-4 gap-2 sm:max-w-md">
            {(Object.keys(CAT_LABEL) as Category[]).map((c) => (
              <ScoreRing key={c} value={r.scores[c]} label={CAT_LABEL[c][lang]} />
            ))}
          </div>
        </div>
      </div>

      {visible.length > 0 && (
        <>
          <h3 className="mt-12 text-lg font-bold">
            {unlocked
              ? pt
                ? "O que melhorar, do mais urgente pro mais simples"
                : "What to improve, from most urgent to simplest"
              : pt
                ? "Os pontos mais graves"
                : "The most serious issues"}
          </h3>
          <ul className="mt-4 grid gap-3">
            {visible.map((i) => (
              <IssueCard key={i.id} issue={i} pt={pt} showFix={unlocked} />
            ))}
          </ul>
        </>
      )}

      {!unlocked && r.issues.length > 0 && (
        <div className="mt-3">
          {locked > 0 && (
            <ul aria-hidden className="pointer-events-none grid select-none gap-3 blur-[3px]">
              {r.issues.slice(FREE_ISSUES, FREE_ISSUES + 2).map((i) => (
                <IssueCard key={i.id} issue={{ ...i, why: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor." }} pt={pt} showFix={false} />
              ))}
            </ul>
          )}
          <div className="mt-6">
            <LeadGate pt={pt} total={r.issues.length} busy={leadBusy} error={leadError} onSubmit={onUnlock} />
          </div>
        </div>
      )}

      {(unlocked || r.issues.length === 0) && (
        <Offer pt={pt} report={r} code={code} name={name} />
      )}

      <button
        type="button"
        onClick={onRestart}
        className="mt-10 inline-flex items-center gap-2 text-sm text-on-surface-variant underline-offset-4 hover:text-on-surface hover:underline"
      >
        <RotateCcw size={15} />
        {pt ? "Analisar outro site" : "Check another site"}
      </button>
    </section>
  );
}

// ── Oferta ──────────────────────────────────────────────────────────────────

function Offer({ pt, report, code, name }: { pt: boolean; report: Report; code: string | null; name: string }) {
  const lang = pt ? "pt" : "en";
  const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;
  const rebuild = needsRebuild(report);
  const ids = rebuild ? ["landing", "site"] : ["revisao-ux"];
  const pkgs = PACKAGES.filter((p) => ids.includes(p.id));
  const wa = `${SOCIALS.whatsapp}?text=${encodeURIComponent(
    code
      ? raioXWhatsappText(name, code, pt)
      : pt
        ? "Olá, fiz o raio-x do meu site e quero conversar sobre melhorias."
        : "Hi, I ran a check on my site and want to talk about improvements.",
  )}`;

  return (
    <div data-origem="raio-x" className="mt-12 rounded-2xl bg-on-surface p-6 text-surface sm:p-8">
      <h3 className="text-2xl font-extrabold tracking-[-0.02em]">
        {pt ? "Quer que eu resolva isso pra você?" : "Want me to fix this for you?"}
      </h3>
      <p className="mt-2 max-w-xl leading-relaxed text-surface/75">
        {rebuild
          ? pt
            ? "Com tanto ponto urgente, sai mais barato fazer um site novo, rápido e pronto pro Google, do que remendar o atual."
            : "With this many urgent issues, a new fast, Google-ready site costs less than patching the current one."
          : pt
            ? "A base está boa. Uma revisão resolve os pontos acima e deixa o site redondo."
            : "The foundation is solid. A review fixes the points above and polishes the site."}
      </p>

      {pkgs.length > 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {pkgs.map((p) => (
            <li key={p.id} className="rounded-xl border border-surface/15 p-4">
              <p className="font-semibold">{p.name[lang]}</p>
              <p className="mt-1 text-sm text-surface/70">{p.summary[lang]}</p>
              <p className="mt-3 text-xl font-extrabold">{brl(p.price)}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#25D366] px-5 font-semibold text-white transition hover:brightness-95"
        >
          <WhatsappIcon size={18} />
          {pt ? "Falar com o Vitor" : "Talk to Vitor"}
        </a>
        <Link
          href="/servicos"
          className="inline-flex h-12 items-center gap-2 rounded-lg border border-surface/25 px-5 font-semibold transition hover:bg-surface/10"
        >
          {pt ? "Ver serviços e preços" : "See services & pricing"}
          <ArrowRight size={17} />
        </Link>
      </div>
      {code && (
        <p className="mt-4 text-sm text-surface/60">
          {pt ? `Seu raio-x é o #${code}. Cite esse número no WhatsApp.` : `Your check is #${code}. Mention it on WhatsApp.`}
        </p>
      )}
    </div>
  );
}
