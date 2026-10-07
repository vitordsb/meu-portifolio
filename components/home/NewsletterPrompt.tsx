"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { readAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";

const KEY = "novidades:v1";
/** "Agora não" vale por 30 dias. */
const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;
/** Aparece depois de metade da página ou de 45 s, o que vier primeiro. */
const SHOW_AFTER_MS = 45_000;
const SHOW_AT_SCROLL = 0.45;

function readState(): { status: "inscrito" | "dispensado"; at: number } | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "null");
  } catch {
    return null;
  }
}
function saveState(status: "inscrito" | "dispensado") {
  try {
    localStorage.setItem(KEY, JSON.stringify({ status, at: Date.now() }));
  } catch {}
}

/**
 * "Quer receber nossas novidades?": cartão discreto no canto inferior direito
 * (logo acima do botão flutuante de orçamento). Só pede
 * o e-mail depois que a pessoa diz que quer (nada de formulário de cara).
 * A lista fica nos Contatos do Resend (app/api/novidades).
 */
export default function NewsletterPrompt() {
  const { language } = useLanguage();
  const pt = language === "pt";
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<"ask" | "form" | "sending" | "done" | "error">("ask");
  const [email, setEmail] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = readState();
    if (saved?.status === "inscrito") return;
    if (saved?.status === "dispensado" && Date.now() - saved.at < SNOOZE_MS) return;

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
      trackEvent("novidades_aberto");
    };
    const timer = setTimeout(show, SHOW_AFTER_MS);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SHOW_AT_SCROLL) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (step === "form") input.current?.focus();
  }, [step]);

  const dismiss = () => {
    saveState("dispensado");
    setVisible(false);
    trackEvent("novidades_dispensado");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("sending");
    try {
      const res = await fetch("/api/novidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: honeypot.current?.value ?? "", origem: readAttribution() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      saveState("inscrito");
      setStep("done");
      trackEvent("novidades_inscrito");
      setTimeout(() => setVisible(false), 3500);
    } catch {
      setStep("error");
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label={pt ? "Receber novidades" : "Get updates"}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-20 left-4 right-4 z-[85] rounded-3xl border border-outline-variant bg-surface p-5 text-on-surface shadow-[var(--elev-3)] sm:bottom-24 sm:left-auto sm:right-6 sm:w-[24rem] sm:p-6"
        >
          {step === "done" ? (
            <p className="flex items-center gap-3 text-base font-semibold">
              <Check size={20} className="shrink-0 text-emerald-500" />
              {pt ? "Pronto! Você vai receber nossas novidades." : "Done! You'll get our updates."}
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="min-w-0">
                <p className="text-base font-bold">{pt ? "Quer receber nossas novidades?" : "Want our updates?"}</p>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  {pt
                    ? "Avisamos por e-mail quando lançarmos algo novo. Sem spam, e você cancela quando quiser."
                    : "We'll email you when we launch something new. No spam, and you can cancel anytime."}{" "}
                  <a href="/privacidade" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-on-surface">
                    {pt ? "Privacidade" : "Privacy"}
                  </a>
                </p>
              </div>

              {step === "ask" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={dismiss}
                    className="h-12 flex-1 rounded-none border border-outline-variant px-5 text-base font-semibold transition-colors hover:border-on-surface/40"
                  >
                    {pt ? "Agora não" : "Not now"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="h-12 flex-1 rounded-none bg-on-surface px-5 text-base font-semibold text-surface transition-opacity hover:opacity-90"
                  >
                    {pt ? "Quero receber" : "Sign me up"}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex w-full flex-col gap-2">
                  {/* Campo-isca: escondido de quem usa o site */}
                  <input
                    ref={honeypot}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="absolute -left-[9999px] h-px w-px opacity-0"
                  />
                  <label className="sr-only" htmlFor="novidades-email">
                    E-mail
                  </label>
                  <input
                    ref={input}
                    id="novidades-email"
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={pt ? "seu@email.com" : "you@email.com"}
                    className="h-12 w-full min-w-0 rounded-none border border-outline-variant bg-surface-low px-4 text-base outline-none focus:border-on-surface"
                  />
                  <button
                    type="submit"
                    disabled={step === "sending"}
                    className="h-12 shrink-0 rounded-none bg-on-surface px-5 text-base font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {step === "sending" ? (pt ? "Enviando..." : "Sending...") : pt ? "Enviar" : "Send"}
                  </button>
                </form>
              )}
            </div>
          )}

          {step === "error" && (
            <p className="mt-3 text-sm text-red-500">
              {pt ? "Não deu certo agora. Tente de novo em instantes." : "That didn't work. Please try again shortly."}
            </p>
          )}

          {step !== "done" && (
            <button
              type="button"
              onClick={dismiss}
              aria-label={pt ? "Fechar" : "Close"}
              className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-none border border-outline-variant bg-surface text-on-surface-variant shadow-sm transition-colors hover:text-on-surface"
            >
              <X size={16} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
