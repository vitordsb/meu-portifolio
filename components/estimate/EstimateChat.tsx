"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import {
  ArrowLeft,
  ArrowUp,
  Check,
  Copy,
  FileText,
  Paperclip,
  Sparkles,
  X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOCIALS } from "@/lib/deck-content";
import type { Estimate } from "@/lib/estimate/scope";
import {
  BRIEFING,
  GREETING,
  INPUT_EXAMPLES,
  MAX_MESSAGE_CHARS,
  MAX_USER_TURNS,
  quoteWhatsappText,
} from "@/lib/estimate/shared";
import EstimateResult from "./EstimateResult";
import LeadForm, { type Lead } from "./LeadForm";
import { prepareImage, PrepareError } from "./prepareImage";

type Msg = {
  role: "user" | "assistant";
  content: string;
  /** Imagens do cliente (data URL JPEG já reduzido). Só vão no pedido. */
  images?: string[];
};

/** Por conversa. O servidor confere de novo (lib/estimate/images.ts). */
const MAX_IMAGES = 4;

/** O que vai pra rota do chat: a IA só recebe a contagem, não a imagem. */
function toApi(msgs: Msg[]) {
  return msgs.map(({ role, content, images }) => ({
    role,
    content,
    ...(images?.length ? { images: images.length } : {}),
  }));
}

type Phase =
  | "chat" // conversando
  | "lead" // IA fechou: pede o contato
  | "done"; // faixa na tela

type Saved = {
  msgs: Msg[];
  phase: Phase;
  estimate: Estimate | null;
  /** Número do pedido (#48213), pro WhatsApp curto. */
  code: string;
  name: string;
  /** E-mail que recebeu a confirmação ("" = nenhum). */
  sentTo?: string;
  /** WhatsApp/e-mail do formulário (pra contraproposta). */
  contact?: { whatsapp: string; email: string };
  counterSent?: boolean;
};

const STORAGE_KEY = "orcamento:v2";
/** A partir daqui aparece o atalho "já contei tudo". */
const SKIP_AFTER = 2;
/** Turnos que a barra de progresso considera "conversa completa". */
const EXPECTED_TURNS = 5;

function load(): Saved | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function save(s: Saved) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // Storage cheio (imagens pesam): guarda a conversa sem elas. Aba
    // anônima: a conversa só não sobrevive ao F5.
    try {
      const light = { ...s, msgs: s.msgs.map(({ images: _, ...m }) => m) };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(light));
    } catch {}
  }
}

/**
 * Orçamento com IA: o visitante conversa com a assistente (DeepSeek), deixa o
 * contato e vê uma faixa de preço calculada pelas métricas do Vitor.
 */
export default function EstimateChat() {
  const { language } = useLanguage();
  const pt = language === "pt";

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [phase, setPhase] = useState<Phase>("chat");
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [contact, setContact] = useState({ whatsapp: "", email: "" });
  const [counterSent, setCounterSent] = useState(false);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Saudação "digitando" ao abrir: -1 = só os três pontinhos; depois a frase
  // aparece letra a letra. Conversa restaurada (F5) mostra direto.
  const [greetShown, setGreetShown] = useState(-1);
  const [exampleIdx, setExampleIdx] = useState(0);
  const reduceMotion = useReducedMotion();
  // Imagens escolhidas e ainda não enviadas (aparecem acima da caixa)
  const [pending, setPending] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  // Aviso das imagens (limite, arquivo ilegível): fica junto das miniaturas,
  // sem o "Abrir WhatsApp" dos erros de conexão
  const [imageNotice, setImageNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const restored = useRef(false);

  const turns = msgs.filter((m) => m.role === "user").length;
  const started = turns > 0;
  const usedImages =
    msgs.reduce((n, m) => n + (m.images?.length ?? 0), 0) + pending.length;

  // ── Persistência na aba (F5 não apaga a conversa) ─────────────────────────
  useEffect(() => {
    const s = load();
    if (s) {
      setMsgs(s.msgs);
      setPhase(s.phase);
      setEstimate(s.estimate);
      setCode(s.code ?? "");
      setSentTo(s.sentTo ?? "");
      if (s.contact) setContact(s.contact);
      setCounterSent(Boolean(s.counterSent));
      setName(s.name);
    }
    restored.current = true;
    if (s?.msgs.length) setGreetShown(Infinity);
  }, []);

  useEffect(() => {
    if (greetShown !== -1) return;
    if (reduceMotion) {
      setGreetShown(Infinity);
      return;
    }
    let typing: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      typing = setInterval(() => {
        setGreetShown((n) => {
          const next = Math.max(0, n) + 2;
          if (next >= GREETING[language].length) clearInterval(typing);
          return next;
        });
      }, 22);
    }, 900);
    return () => {
      clearTimeout(start);
      clearInterval(typing);
    };
    // só na abertura
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  // Exemplos girando no texto de exemplo da caixa, até a primeira mensagem
  useEffect(() => {
    if (started || input) return;
    const t = setInterval(
      () => setExampleIdx((i) => (i + 1) % INPUT_EXAMPLES.pt.length),
      3200,
    );
    return () => clearInterval(t);
  }, [started, input]);

  useEffect(() => {
    if (restored.current && !streaming)
      save({ msgs, phase, estimate, code, name, sentTo, contact, counterSent });
  }, [
    msgs,
    phase,
    estimate,
    code,
    name,
    sentTo,
    contact,
    counterSent,
    streaming,
  ]);

  // ── Rolagem: acompanha o fim da conversa ──────────────────────────────────
  // Antes da primeira mensagem, o topo (título + modelo) é o que importa.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (msgs.length === 0) {
      el.scrollTo({ top: 0 });
      return;
    }
    el.scrollTo({
      top: el.scrollHeight,
      behavior: streaming ? "auto" : "smooth",
    });
  }, [msgs, phase, notice, streaming]);

  // ── Caixa de texto cresce com o conteúdo ──────────────────────────────────
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, window.innerHeight * 0.4)}px`;
  }, [input]);

  const send = useCallback(
    async (text: string) => {
      const images = pending;
      // Só imagem, sem texto: manda uma frase curta junto
      const content =
        text.trim() ||
        (images.length
          ? pt
            ? images.length > 1
              ? "Seguem as imagens."
              : "Segue a imagem."
            : images.length > 1
              ? "Here are the images."
              : "Here is the image."
          : "");
      if (!content || streaming || turns >= MAX_USER_TURNS) return;

      const history: Msg[] = [
        ...msgs,
        { role: "user", content, ...(images.length ? { images } : {}) },
      ];
      setMsgs([...history, { role: "assistant", content: "" }]);
      setInput("");
      setPending([]);
      setImageNotice(null);
      if (images.length) trackEvent("orcamento_imagem", { qtd: images.length });
      setNotice(null);
      setStreaming(true);
      if (turns === 0) trackEvent("orcamento_inicio");

      const fail = (message: string) => {
        // Tira a bolha vazia da assistente; a mensagem do cliente fica
        setMsgs((m) => (m[m.length - 1]?.content ? m : m.slice(0, -1)));
        setNotice(message);
      };

      try {
        const res = await fetch("/api/orcamento/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: toApi(history) }),
        });

        if (!res.ok || !res.body) {
          const err = await res.json().catch(() => ({}));
          fail(
            res.status === 429
              ? pt
                ? `Muitas mensagens em pouco tempo. Tenta de novo em ${err.retryAfterMin ?? "alguns"} min, ou me chama no WhatsApp.`
                : `Too many messages. Try again in ${err.retryAfterMin ?? "a few"} min, or reach me on WhatsApp.`
              : pt
                ? "A assistente está fora do ar agora. Me chama no WhatsApp que eu respondo pessoalmente."
                : "The assistant is offline right now. Reach me on WhatsApp and I'll answer personally.",
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let ready = false;
        let broke = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            if (!line) continue;
            const ev = JSON.parse(line) as {
              t: string;
              v?: string;
              ready?: boolean;
            };
            if (ev.t === "d" && ev.v) {
              const piece = ev.v;
              setMsgs((m) => {
                const last = m[m.length - 1];
                return [
                  ...m.slice(0, -1),
                  { ...last, content: last.content + piece },
                ];
              });
            } else if (ev.t === "replace" && typeof ev.v === "string") {
              // O servidor barrou a resposta (parecia vazamento): troca inteira
              const text = ev.v;
              setMsgs((m) => [
                ...m.slice(0, -1),
                { role: "assistant", content: text },
              ]);
            } else if (ev.t === "end") {
              ready = Boolean(ev.ready);
            } else if (ev.t === "err") {
              broke = true;
            }
          }
        }

        if (broke) {
          fail(
            pt
              ? "A resposta caiu no meio do caminho. Manda de novo?"
              : "The reply got cut off. Send it again?",
          );
        } else if (ready) {
          setPhase("lead");
          trackEvent("orcamento_pronto", { turnos: turns + 1 });
        }
      } catch {
        fail(
          pt
            ? "Sem conexão. Confere a internet e manda de novo."
            : "No connection. Check your internet and try again.",
        );
      } finally {
        setStreaming(false);
      }
    },
    [msgs, pending, pt, streaming, turns],
  );

  /** Upload, colar ou arrastar: reduz no navegador e põe na fila. */
  const addFiles = async (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    const room = MAX_IMAGES - usedImages;
    if (room <= 0) {
      setImageNotice(
        pt
          ? `Dá pra anexar até ${MAX_IMAGES} imagens por conversa.`
          : `You can attach up to ${MAX_IMAGES} images per conversation.`,
      );
      return;
    }
    setImageNotice(null);
    const ready: string[] = [];
    let failed = false;
    for (const file of images.slice(0, room)) {
      try {
        ready.push(await prepareImage(file));
      } catch (e) {
        failed = true;
        if (!(e instanceof PrepareError)) console.error(e);
      }
    }
    if (ready.length) setPending((p) => [...p, ...ready].slice(0, MAX_IMAGES));
    if (failed || images.length > room) {
      setImageNotice(
        pt
          ? images.length > room
            ? `Anexei ${Math.min(room, ready.length)}: o limite é ${MAX_IMAGES} imagens por conversa.`
            : "Não consegui abrir uma das imagens. Tenta em JPG ou PNG."
          : images.length > room
            ? `Attached ${Math.min(room, ready.length)}: the limit is ${MAX_IMAGES} images per conversation.`
            : "Couldn't open one of the images. Try JPG or PNG.",
      );
    }
    inputRef.current?.focus();
  };

  const submitLead = async (lead: Lead) => {
    setBusy(true);
    setLeadError(null);
    try {
      const res = await fetch("/api/orcamento/estimativa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origem: readAttribution(),
          messages: toApi(msgs),
          images: msgs.flatMap((m) => m.images ?? []),
          lead: { ...lead, consent: true },
          lang: language,
        }),
      });
      const data = await res.json().catch(() => ({}));
      setName(lead.name);
      setContact({ whatsapp: lead.whatsapp, email: lead.email.trim() });
      if (typeof data.code === "string") setCode(data.code);
      setSentTo(data.confirmationSent ? lead.email.trim() : "");

      if (res.ok && data.estimate) {
        setEstimate(data.estimate as Estimate);
        setPhase("done");
        trackEvent("orcamento_lead", { faixaMin: data.estimate.min });
      } else if (data.saved) {
        // Contato salvo, só a conta falhou: vira pedido sem faixa na tela
        setPhase("done");
        trackEvent("orcamento_lead", { faixaMin: 0 });
      } else if (res.status === 403 || res.status === 503) {
        setLeadError(
          pt
            ? "Não consegui gerar o orçamento agora. Me chama no WhatsApp que eu te respondo pessoalmente."
            : "I couldn't generate the quote right now. Reach me on WhatsApp and I'll answer personally.",
        );
      } else if (res.status === 429) {
        setLeadError(
          pt
            ? "Muitos orçamentos seguidos daqui. Tenta de novo mais tarde ou me chama no WhatsApp."
            : "Too many quotes in a row. Try again later or reach me on WhatsApp.",
        );
      } else {
        setLeadError(
          pt
            ? "Confere o nome e o WhatsApp (com DDD) e tenta de novo."
            : "Check your name and WhatsApp number (with area code) and try again.",
        );
      }
    } catch {
      setLeadError(
        pt ? "Sem conexão. Tenta de novo." : "No connection. Try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    setMsgs([]);
    setPhase("chat");
    setEstimate(null);
    setCode("");
    setSentTo("");
    setNotice(null);
    setLeadError(null);
    setInput("");
    setPending([]);
    setCounterSent(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const applyTemplate = () => {
    setInput(BRIEFING[language]);
    trackEvent("orcamento_modelo");
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      // Cursor no fim da primeira linha: é onde a pessoa começa a escrever
      const firstEnd = BRIEFING[language].indexOf("\n");
      el.setSelectionRange(firstEnd, firstEnd);
      el.scrollTop = 0;
    });
  };

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(BRIEFING[language]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const progress =
    phase === "chat" ? Math.min(0.92, turns / EXPECTED_TURNS) : 1;
  const tooLong = input.length > MAX_MESSAGE_CHARS;
  // Modelo enviado em branco não diz nada: espera a pessoa preencher
  const blankTemplate = input.trim() === BRIEFING[language].trim();
  const canSend =
    (input.trim().length > 0 || pending.length > 0) &&
    !tooLong &&
    !blankTemplate &&
    !streaming;
  const whatsappHref = `${SOCIALS.whatsapp}?text=${encodeURIComponent(
    pt
      ? "Oi Vitor! Queria um orçamento de um projeto."
      : "Hi Vitor! I'd like a quote for a project.",
  )}`;

  return (
    <div className="flex h-dvh flex-col bg-surface text-on-surface">
      {/* ── Topo ── */}
      <header className="relative shrink-0 border-b border-outline-variant">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between gap-4 px-4 [@media(max-height:500px)]:h-11">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-[-0.01em] transition-opacity hover:opacity-70"
          >
            <ArrowLeft size={16} />
            Vitor de Souza
          </Link>
        </div>
        <motion.span
          aria-hidden
          className="absolute bottom-[-1px] left-0 h-px origin-left bg-on-surface"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
        />
      </header>

      {/* ── Conversa ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pb-8 pt-8 sm:pt-12 [@media(max-height:500px)]:pt-5">
          {!started && (
            <div className="mb-2">
              <h1 className="text-[clamp(2rem,6vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.035em] [@media(max-height:500px)]:text-[1.75rem]">
                {pt
                  ? "Quanto custa tirar sua ideia do papel?"
                  : "How much does it cost to build your idea?"}
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-on-surface-variant">
                {pt
                  ? "Converse 2 minutos e receba o valor de partida do seu projeto."
                  : "Chat for 2 minutes and get your project's starting price."}
              </p>
            </div>
          )}

          <Bubble role="assistant">
            {greetShown < 0 ? (
              <TypingDots label={pt ? "Digitando" : "Typing"} />
            ) : (
              <span aria-label={GREETING[language]}>
                {GREETING[language].slice(0, greetShown)}
              </span>
            )}
          </Bubble>

          <AnimatePresence initial={false}>
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
              >
                <Bubble role={m.role} images={m.images}>
                  {m.content.trimEnd() || (
                    <TypingDots label={pt ? "Digitando" : "Typing"} />
                  )}
                </Bubble>
              </motion.div>
            ))}
          </AnimatePresence>

          {notice && (
            <div role="alert" className="pl-10">
              <p className="text-sm text-on-surface-variant">{notice}</p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex text-sm font-semibold text-on-surface underline underline-offset-4"
              >
                {pt ? "Abrir WhatsApp" : "Open WhatsApp"}
              </a>
            </div>
          )}

          {phase === "lead" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <LeadForm
                pt={pt}
                busy={busy}
                error={leadError}
                onSubmit={submitLead}
                onKeepTalking={
                  turns < MAX_USER_TURNS
                    ? () => {
                        setPhase("chat");
                        setLeadError(null);
                        requestAnimationFrame(() => inputRef.current?.focus());
                      }
                    : undefined
                }
              />
            </motion.div>
          )}

          {phase === "done" && !estimate && code && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-outline-variant bg-surface-low p-5 sm:p-7"
            >
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">
                {pt ? "Pedido" : "Quote"} #{code}
              </p>
              <h2 className="text-xl font-extrabold tracking-[-0.02em]">
                {pt ? "Recebi seu pedido" : "I got your request"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {pt
                  ? "A calculadora falhou agora, mas a conversa chegou inteira pra mim. Eu te mando o valor de partida pelo WhatsApp, ou me chama citando o número do pedido."
                  : "The calculator failed just now, but the whole chat reached me. I'll send you the starting price on WhatsApp, or reach me mentioning the quote number."}
                {sentTo &&
                  (pt
                    ? ` Mandei a confirmação pra ${sentTo}.`
                    : ` I sent a confirmation to ${sentTo}.`)}
              </p>
              <a
                href={`${SOCIALS.whatsapp}?text=${encodeURIComponent(quoteWhatsappText(name, code, pt))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mt-5 h-12 rounded-lg bg-[#25D366] px-6 text-base text-white"
              >
                <span>{pt ? "Falar com o Vitor" : "Talk to Vitor"}</span>
              </a>
            </motion.div>
          )}

          {phase === "done" && estimate && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <EstimateResult
                estimate={estimate}
                code={code}
                name={name}
                sentTo={sentTo}
                contact={contact}
                counterSent={counterSent}
                onCounterSent={() => setCounterSent(true)}
                pt={pt}
                onRestart={restart}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Caixa de mensagem ── */}
      {phase === "chat" && (
        <div className="shrink-0 border-t border-outline-variant bg-surface pb-[env(safe-area-inset-bottom)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canSend) send(input);
            }}
            className="mx-auto w-full max-w-2xl px-4 py-3 [@media(max-height:500px)]:py-2"
            onDragOver={(e) => {
              if (e.dataTransfer.types.includes("Files")) {
                e.preventDefault();
                setDragging(true);
              }
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(Array.from(e.dataTransfer.files));
            }}
          >
            {/* Modelo de briefing logo acima da caixa: só antes da 1ª mensagem */}
            {!started && (
              <div className="mb-2 flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={applyTemplate}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-outline-variant px-3.5 text-[13px] font-medium transition-colors hover:border-on-surface/60"
                >
                  <FileText size={14} />
                  {pt ? "Usar modelo de briefing" : "Use briefing template"}
                </button>
                <button
                  type="button"
                  onClick={copyTemplate}
                  aria-label={pt ? "Copiar modelo" : "Copy template"}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] text-on-surface-variant transition-colors hover:bg-surface-high hover:text-on-surface"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied
                    ? pt
                      ? "Copiado"
                      : "Copied"
                    : pt
                      ? "Copiar"
                      : "Copy"}
                </button>
              </div>
            )}
            {/* Imagens na fila, antes de enviar */}
            {pending.length > 0 && (
              <ul
                className="mb-2 flex flex-wrap gap-2"
                aria-label={pt ? "Imagens anexadas" : "Attached images"}
              >
                {pending.map((src, i) => (
                  <li key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="h-16 w-16 rounded-lg border border-outline-variant object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPending((p) => p.filter((_, j) => j !== i))
                      }
                      aria-label={
                        pt ? `Remover imagem ${i + 1}` : `Remove image ${i + 1}`
                      }
                      className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-outline-variant bg-surface text-on-surface shadow-sm hover:bg-surface-high"
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {imageNotice && (
              <p
                role="status"
                className="mb-2 px-1 text-xs text-on-surface-variant"
              >
                {imageNotice}
              </p>
            )}

            <div
              className={`flex items-end gap-1 rounded-2xl border bg-surface-low p-2 transition-colors focus-within:border-on-surface/50 ${
                dragging
                  ? "border-on-surface border-dashed"
                  : "border-outline-variant"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  addFiles(Array.from(e.target.files ?? []));
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={usedImages >= MAX_IMAGES || streaming}
                aria-label={pt ? "Anexar imagem" : "Attach image"}
                title={
                  pt
                    ? "Anexar imagem (ou cole/arraste aqui)"
                    : "Attach image (or paste/drop here)"
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-high hover:text-on-surface disabled:opacity-30"
              >
                <Paperclip size={18} />
              </button>
              <label htmlFor="orcamento-input" className="sr-only">
                {pt ? "Sua mensagem" : "Your message"}
              </label>
              <textarea
                id="orcamento-input"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={(e) => {
                  // Print colado (Ctrl/⌘+V): vira anexo. Se também tem texto
                  // no que foi copiado, o texto cola normalmente.
                  const files = Array.from(e.clipboardData.files).filter((f) =>
                    f.type.startsWith("image/"),
                  );
                  if (!files.length) return;
                  if (!e.clipboardData.getData("text")) e.preventDefault();
                  addFiles(files);
                }}
                onKeyDown={(e) => {
                  // Enter envia no computador; no celular, Enter é quebra de linha
                  const touch = window.matchMedia("(pointer: coarse)").matches;
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !touch &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    if (canSend) send(input);
                  }
                }}
                placeholder={
                  started
                    ? pt
                      ? "Responda aqui..."
                      : "Reply here..."
                    : INPUT_EXAMPLES[language][exampleIdx]
                }
                className="max-h-[40vh] min-h-10 flex-1 resize-none bg-transparent py-2 text-base leading-6 outline-none placeholder:text-on-surface-variant sm:text-[15px]"
              />
              <button
                type="submit"
                disabled={!canSend}
                aria-label={pt ? "Enviar" : "Send"}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-opacity disabled:opacity-30"
              >
                <ArrowUp size={18} />
              </button>
            </div>

            <div className="mt-2 flex min-h-5 items-center justify-between gap-3 px-1 text-xs text-on-surface-variant [@media(max-height:500px)]:mt-1 [@media(max-height:500px)]:min-h-0">
              {tooLong ? (
                <span className="text-error">
                  {pt
                    ? `Mensagem longa demais (${input.length}/${MAX_MESSAGE_CHARS}).`
                    : `Message too long (${input.length}/${MAX_MESSAGE_CHARS}).`}
                </span>
              ) : (
                <span className="[@media(max-height:500px)]:hidden">
                  {pt
                    ? "Estimativa sem compromisso."
                    : "No-commitment estimate."}
                </span>
              )}
              {turns >= SKIP_AFTER && !streaming && (
                <button
                  type="button"
                  onClick={() => setPhase("lead")}
                  className="shrink-0 font-semibold text-on-surface underline-offset-4 hover:underline"
                >
                  {pt
                    ? "Já contei tudo, ver orçamento"
                    : "That's all, see quote"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Bubble({
  role,
  images,
  children,
}: {
  role: "user" | "assistant";
  images?: string[];
  children: React.ReactNode;
}) {
  if (role === "user") {
    return (
      <div className="flex flex-col items-end gap-1.5">
        {images?.length ? (
          <div className="flex max-w-[85%] flex-wrap justify-end gap-1.5">
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                className="h-28 w-28 rounded-xl border border-outline-variant object-cover sm:h-32 sm:w-32"
              />
            ))}
          </div>
        ) : null}
        <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-surface-high px-4 py-2.5 text-[15px] leading-relaxed">
          {children}
        </p>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <span
        aria-hidden
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant"
      >
        <Sparkles size={13} />
      </span>
      <div className="min-w-0 flex-1 whitespace-pre-wrap break-words pt-0.5 text-[15px] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function TypingDots({ label }: { label: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-flex h-6 items-center gap-1"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-on-surface-variant"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}
