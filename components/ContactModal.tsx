"use client";

import { useState, useEffect, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Linkedin,
  Github,
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

const CHANNELS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/5511939572807",
    descPt: "Resposta rápida no chat",
    descEn: "Quick reply on chat",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/vitordsb",
    descPt: "Conexão profissional",
    descEn: "Professional connection",
  },
  {
    key: "github",
    label: "GitHub",
    icon: Github,
    href: "https://github.com/vitordsb",
    descPt: "Veja meu código",
    descEn: "See my code",
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

export default function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>("channel");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep("channel");
        setError(null);
        setForm({ name: "", email: "", company: "", subject: "", message: "" });
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
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition";

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-foreground/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[95] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 focus:outline-none">
          {/* Close */}
          <Dialog.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition">
            <X size={18} />
          </Dialog.Close>

          {/* STEP: escolha de canal */}
          {step === "channel" && (
            <>
              <Dialog.Title className="text-xl font-extrabold tracking-tight mb-1">
                {pt ? "Vamos conversar?" : "Let's talk?"}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mb-6">
                {pt
                  ? "Como você prefere entrar em contato?"
                  : "How would you prefer to reach out?"}
              </Dialog.Description>
              <div className="flex flex-col gap-2.5">
                {CHANNELS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => handleChannel(c.href)}
                    className="group flex items-center gap-4 rounded-xl border border-border p-3.5 text-left hover:border-accent hover:bg-accent/5 transition"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-background transition">
                      <c.icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">{c.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {pt ? c.descPt : c.descEn}
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-0.5 transition"
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
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-accent transition"
              >
                <ArrowLeft size={14} />
                {pt ? "Voltar" : "Back"}
              </button>
              <Dialog.Title className="text-xl font-extrabold tracking-tight mb-1">
                {pt ? "Me conta mais" : "Tell me more"}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mb-5">
                {pt
                  ? "Preencha e eu retorno em até 24h úteis."
                  : "Fill this in and I'll reply within 24 business hours."}
              </Dialog.Description>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                {error && <p className="text-xs text-destructive font-medium">{error}</p>}
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-brutalist-accent px-6 py-3 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {pt ? "Enviando…" : "Sending…"}
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CheckCircle2 size={34} />
              </div>
              <Dialog.Title className="text-xl font-extrabold tracking-tight mb-2">
                {pt ? "Mensagem enviada! 🎉" : "Message sent! 🎉"}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                {pt
                  ? `Obrigado pelo contato, ${form.name.split(" ")[0] || ""}! Vou responder em até 24h úteis.`
                  : `Thanks for reaching out, ${form.name.split(" ")[0] || ""}! I'll reply within 24 business hours.`}
              </Dialog.Description>
              <button
                onClick={onClose}
                className="btn-brutalist-outline px-6 py-2.5 text-sm"
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
