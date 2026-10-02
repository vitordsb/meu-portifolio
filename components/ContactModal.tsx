"use client";

import { useState, useEffect, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  MessageCircle,
  AtSign,
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { sendContactMessage } from "@/lib/actions";

type Step = "channel" | "email" | "thanks";

const WHATSAPP = "https://wa.me/5511939572807";

const CHANNELS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    href: WHATSAPP,
    descPt: "Resposta rápida no chat",
    descEn: "Quick reply on chat",
  },
  {
    key: "email",
    label: "Email",
    icon: AtSign,
    href: null,
    descPt: "Envie uma mensagem detalhada",
    descEn: "Send a detailed message",
  },
] as const;

/** Link do WhatsApp com a mensagem já escrita quando há assunto. */
function whatsappHref(subject: string | null, pt: boolean): string {
  if (!subject) return WHATSAPP;
  const text = pt
    ? `Oi Vitor! Vim pelo seu portfólio e quero falar sobre: ${subject}.`
    : `Hi Vitor! I found your portfolio and I'd like to talk about: ${subject}.`;
  return `${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export default function ContactModal({
  isOpen,
  onClose,
  subject = null,
}: {
  isOpen: boolean;
  onClose: () => void;
  subject?: string | null;
}) {
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>("channel");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "", website: "" });

  // Assunto vindo do CTA entra no formulário ao abrir
  useEffect(() => {
    if (isOpen && subject) setForm((f) => ({ ...f, subject }));
  }, [isOpen, subject]);

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep("channel");
        setError(null);
        setForm({ name: "", email: "", company: "", subject: "", message: "", website: "" });
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const pt = language === "pt";

  const handleChannel = (href: string | null) => {
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
      onClose();
    } else {
      setStep("email");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await sendContactMessage(form);
      if (res.ok) setStep("thanks");
      else setError(res.error ?? (pt ? "Erro ao enviar." : "Failed to send."));
    });
  };

  const field =
    "w-full rounded-[var(--shape-md)] bg-surface-container px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition";

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-scrim/32 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[95] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-outline-variant bg-surface p-6 elev-3 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 focus:outline-none">
          {/* Close */}
          <Dialog.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-high hover:text-on-surface transition">
            <X size={18} />
          </Dialog.Close>

          {/* STEP: escolha de canal */}
          {step === "channel" && (
            <>
              {subject && (
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-brand">
                  {subject}
                </p>
              )}
              <Dialog.Title className="text-xl font-extrabold tracking-tight mb-1">
                {pt ? "Vamos conversar?" : "Let's talk?"}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-on-surface-variant mb-6">
                {pt
                  ? "Como você prefere entrar em contato?"
                  : "How would you prefer to reach out?"}
              </Dialog.Description>
              <div className="flex flex-col gap-2.5">
                {CHANNELS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() =>
                      handleChannel(c.key === "whatsapp" ? whatsappHref(subject, pt) : c.href)
                    }
                    className="group flex items-center gap-4 rounded-[var(--shape-md)] border border-outline-variant p-3.5 text-left hover:border-primary hover:bg-primary-container transition"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container group-hover:bg-primary group-hover:text-on-primary transition">
                      <c.icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">{c.label}</span>
                      <span className="block text-xs text-on-surface-variant">
                        {pt ? c.descPt : c.descEn}
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-on-surface-variant/50 group-hover:text-primary group-hover:translate-x-0.5 transition"
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* STEP: formulário de email */}
          {step === "email" && (
            <>
              <button
                onClick={() => setStep("channel")}
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition"
              >
                <ArrowLeft size={14} />
                {pt ? "Voltar" : "Back"}
              </button>
              <Dialog.Title className="text-xl font-extrabold tracking-tight mb-1">
                {pt ? "Me conta mais" : "Tell me more"}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-on-surface-variant mb-5">
                {pt
                  ? "Preencha e eu retorno em até 24h úteis."
                  : "Fill this in and I'll reply within 24 business hours."}
              </Dialog.Description>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Campo-isca (anti-robô): fora da tela, fora do Tab e do leitor
                    de tela. Pessoa não preenche; robô preenche e é descartado. */}
                <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                  <label>
                    Website
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder={pt ? "Nome *" : "Name *"}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={field}
                  />
                  <input
                    placeholder={pt ? "Empresa" : "Company"}
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    className={field}
                  />
                </div>
                <input
                  type="email"
                  placeholder={pt ? "Seu email (pra eu responder)" : "Your email (so I can reply)"}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={field}
                />
                <input
                  placeholder={pt ? "Assunto" : "Subject"}
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className={field}
                />
                <textarea
                  required
                  placeholder={pt ? "Mensagem *" : "Message *"}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className={`${field} h-28 resize-none`}
                />
                {error && <p className="text-xs text-error font-medium">{error}</p>}
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-filled px-6 py-3 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {pt ? "Enviando..." : "Sending..."}
                    </>
                  ) : (
                    <>{pt ? "Enviar mensagem" : "Send message"}</>
                  )}
                </button>
              </form>
            </>
          )}

          {/* STEP: agradecimento */}
          {step === "thanks" && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                <CheckCircle2 size={34} />
              </div>
              <Dialog.Title className="text-xl font-extrabold tracking-tight mb-2">
                {pt ? "Mensagem enviada" : "Message sent"}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-on-surface-variant mb-6 max-w-xs mx-auto">
                {pt
                  ? `Obrigado pelo contato, ${form.name.split(" ")[0] || ""}! Vou responder em até 24h úteis.`
                  : `Thanks for reaching out, ${form.name.split(" ")[0] || ""}! I'll reply within 24 business hours.`}
              </Dialog.Description>
              <button
                onClick={onClose}
                className="btn btn-outlined px-6 py-2.5 text-sm"
              >
                {pt ? "Fechar" : "Close"}
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
