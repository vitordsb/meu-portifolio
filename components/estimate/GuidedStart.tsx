import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CalendarClock,
  Check,
  ChevronLeft,
  Clock,
  CreditCard,
  Globe,
  HelpCircle,
  Images,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  Mic,
  Palette,
  PenLine,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Square,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { speechErrorText, useSpeech } from "./useSpeech";

/**
 * Começo guiado do orçamento: em vez de uma caixa de texto em branco, a
 * pessoa toca em opções grandes e, no fim, pode FALAR a ideia (ditado do
 * navegador). Pensado pra quem tem mais idade e não gosta de digitar.
 *
 * As respostas viram a primeira mensagem do chat: a IA recebe tudo de uma
 * vez e só pergunta o que faltar. "Prefiro escrever" pula pro chat livre.
 */

type L = { pt: string; en: string };
type Option = { id: string; icon: LucideIcon; label: L; hint?: L };

// Do mais complexo ao mais simples, como na home. Loja virtual saiu da
// oferta (Vitor, 07/out/2026): quem quer vender online cai em "sistema".
const TYPES: Option[] = [
  {
    id: "sistema",
    icon: LayoutDashboard,
    label: { pt: "Sistema pra empresa", en: "Business system" },
    hint: {
      pt: "Organizar agenda, pedidos, estoque",
      en: "Organize bookings, orders, stock",
    },
  },
  {
    id: "app",
    icon: Smartphone,
    label: { pt: "Aplicativo de celular", en: "Mobile app" },
    hint: { pt: "Pra iPhone e Android", en: "For iPhone and Android" },
  },
  {
    id: "site",
    icon: Globe,
    label: { pt: "Site da minha empresa", en: "Company website" },
    hint: {
      pt: "Mostrar quem você é e o que faz",
      en: "Show who you are and what you do",
    },
  },
  {
    id: "landing",
    icon: Megaphone,
    label: { pt: "Página de divulgação", en: "Promo page" },
    hint: {
      pt: "Uma página pra um produto ou evento",
      en: "One page for a product or event",
    },
  },
  {
    id: "outro",
    icon: HelpCircle,
    label: { pt: "Ainda não sei", en: "Not sure yet" },
    hint: { pt: "Me ajuda a descobrir", en: "Help me figure it out" },
  },
];

const FEATURES: Option[] = [
  {
    id: "agenda",
    icon: CalendarCheck,
    label: { pt: "Agendar horários", en: "Book appointments" },
  },
  {
    id: "pagamento",
    icon: CreditCard,
    label: { pt: "Receber pagamentos", en: "Take payments" },
  },
  {
    id: "venda",
    icon: ShoppingCart,
    label: { pt: "Vender produtos", en: "Sell products" },
  },
  {
    id: "fotos",
    icon: Images,
    label: { pt: "Mostrar fotos e trabalhos", en: "Show photos and work" },
  },
  {
    id: "whatsapp",
    icon: MessageCircle,
    label: { pt: "Contato pelo WhatsApp", en: "Contact via WhatsApp" },
  },
  {
    id: "login",
    icon: UserRound,
    label: { pt: "Área de clientes com login", en: "Customer login area" },
  },
  {
    id: "painel",
    icon: BarChart3,
    label: { pt: "Painel pra gerenciar", en: "Admin dashboard" },
  },
];

const VISUAL: Option[] = [
  {
    id: "pronto",
    icon: Palette,
    label: { pt: "Tenho logo e cores", en: "I have a logo and colors" },
  },
  {
    id: "referencias",
    icon: Images,
    label: { pt: "Tenho exemplos que gosto", en: "I have examples I like" },
  },
  {
    id: "nada",
    icon: Sparkles,
    label: { pt: "Não tenho nada ainda", en: "Nothing yet" },
  },
];

const PRAZO: Option[] = [
  {
    id: "urgente",
    icon: Zap,
    label: { pt: "Urgente", en: "Urgent" },
    hint: { pt: "Menos de 1 mês", en: "Under 1 month" },
  },
  {
    id: "normal",
    icon: Clock,
    label: { pt: "Em 1 a 3 meses", en: "In 1 to 3 months" },
  },
  {
    id: "flexivel",
    icon: CalendarClock,
    label: { pt: "Sem pressa", en: "No rush" },
  },
];

const STEPS = 5;

type Answers = {
  tipo?: string;
  recursos: string[];
  visual?: string;
  prazo?: string;
  detalhes: string;
};

function label(list: Option[], id: string | undefined, lang: "pt" | "en") {
  return list.find((o) => o.id === id)?.label[lang];
}

/** A primeira mensagem do chat, montada com as respostas. */
export function composeMessage(a: Answers, lang: "pt" | "en") {
  const pt = lang === "pt";
  const recursos = a.recursos
    .map((id) => label(FEATURES, id, lang))
    .filter(Boolean);
  const lines = [
    `${pt ? "Quero criar" : "I want to build"}: ${label(TYPES, a.tipo, lang) ?? (pt ? "ainda não sei" : "not sure yet")}.`,
    recursos.length
      ? `${pt ? "Precisa" : "It needs"}: ${recursos.join(", ")}.`
      : "",
    a.visual
      ? `${pt ? "Visual" : "Visuals"}: ${label(VISUAL, a.visual, lang)}.`
      : "",
    a.prazo
      ? `${pt ? "Prazo" : "Timeline"}: ${label(PRAZO, a.prazo, lang)}${a.prazo === "urgente" ? (pt ? " (menos de 1 mês)" : " (under 1 month)") : ""}.`
      : "",
    a.detalhes.trim()
      ? `${pt ? "Mais detalhes" : "More details"}: ${a.detalhes.trim()}`
      : "",
  ];
  return lines.filter(Boolean).join("\n");
}

const tile =
  "group flex w-full items-center gap-4 border-2 p-4 text-left transition-colors sm:p-5";

export default function GuidedStart({
  lang,
  onFinish,
  onWrite,
}: {
  lang: "pt" | "en";
  onFinish: (message: string) => void;
  onWrite: () => void;
}) {
  const pt = lang === "pt";
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [a, setA] = useState<Answers>({ recursos: [], detalhes: "" });
  const speech = useSpeech(lang, (text) => {
    setA((x) => ({
      ...x,
      detalhes: x.detalhes ? `${x.detalhes} ${text}` : text,
    }));
    trackEvent("orcamento_voz");
  });

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    trackEvent("orcamento_guiado_passo", { passo: next + 1 });
  };
  const pick = (key: "tipo" | "visual" | "prazo", id: string) => {
    setA((x) => ({ ...x, [key]: id }));
    // Escolha única avança sozinha: um toque por pergunta
    window.setTimeout(() => go(step + 1), reduce ? 0 : 180);
  };
  const toggleFeature = (id: string) =>
    setA((x) => ({
      ...x,
      recursos: x.recursos.includes(id)
        ? x.recursos.filter((r) => r !== id)
        : [...x.recursos, id],
    }));
  const finish = () => {
    speech.stop();
    trackEvent("orcamento_guiado_fim", {
      recursos: a.recursos.length,
      voz: a.detalhes ? 1 : 0,
    });
    onFinish(composeMessage(a, lang));
  };

  const titles: L[] = [
    { pt: "O que você quer criar?", en: "What do you want to build?" },
    { pt: "O que ele precisa fazer?", en: "What should it do?" },
    { pt: "Já tem logo ou visual?", en: "Do you have a logo or visuals?" },
    { pt: "Pra quando você precisa?", en: "When do you need it?" },
    { pt: "Quer contar mais alguma coisa?", en: "Anything else to add?" },
  ];
  const subtitles: L[] = [
    { pt: "Toque em uma opção.", en: "Tap an option." },
    { pt: "Pode escolher mais de uma.", en: "You can pick more than one." },
    { pt: "Toque em uma opção.", en: "Tap an option." },
    { pt: "Toque em uma opção.", en: "Tap an option." },
    {
      pt: "Fale como num áudio do WhatsApp: qual é o seu negócio e o que não pode faltar. É opcional.",
      en: "Talk like a voice message: what your business is and what can't be missing. Optional.",
    },
  ];

  const single = (
    list: Option[],
    key: "tipo" | "visual" | "prazo",
    cols = "sm:grid-cols-2",
  ) => (
    <div className={`grid gap-3 ${cols}`}>
      {list.map((o) => {
        const on = a[key] === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => pick(key, o.id)}
            aria-pressed={on}
            className={`${tile} min-h-[76px] ${cols === "sm:grid-cols-2" ? "sm:[&:last-child:nth-child(odd)]:col-span-2" : ""} ${on ? "border-on-surface bg-surface-high" : "border-outline-variant bg-surface-low hover:border-on-surface/50"}`}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-surface text-on-surface">
              <o.icon size={26} strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-semibold leading-snug">
                {o.label[lang]}
              </span>
              {o.hint && (
                <span className="mt-0.5 block text-[0.9375rem] leading-snug text-on-surface-variant">
                  {o.hint[lang]}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <section
      aria-label={pt ? "Perguntas rápidas" : "Quick questions"}
      className="flex flex-col"
    >
      {/* Progresso: em texto e em barras, pra não deixar dúvida de onde está */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-base font-medium text-on-surface-variant">
          {pt
            ? `Passo ${step + 1} de ${STEPS}`
            : `Step ${step + 1} of ${STEPS}`}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {Array.from({ length: STEPS }, (_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${i <= step ? "w-6 bg-on-surface" : "w-2 bg-on-surface/20"}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div
          key={step}
          custom={dir}
          initial={reduce ? false : { opacity: 0, x: dir * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -24 }}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        >
          <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-[-0.02em] sm:text-3xl">
            {titles[step][lang]}
          </h2>
          <p className="mt-2 text-lg leading-relaxed text-on-surface-variant">
            {subtitles[step][lang]}
          </p>

          <div className="mt-6">
            {step === 0 && single(TYPES, "tipo")}

            {step === 1 && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  {FEATURES.map((o) => {
                    const on = a.recursos.includes(o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => toggleFeature(o.id)}
                        aria-pressed={on}
                        className={`${tile} min-h-[64px] ${on ? "border-on-surface bg-surface-high" : "border-outline-variant bg-surface-low hover:border-on-surface/50"}`}
                      >
                        <o.icon
                          size={24}
                          strokeWidth={1.75}
                          className="shrink-0"
                        />
                        <span className="flex-1 text-lg font-semibold leading-snug">
                          {o.label[lang]}
                        </span>
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center border-2 ${on ? "border-on-surface bg-on-surface text-surface" : "border-outline-variant"}`}
                          aria-hidden
                        >
                          {on && <Check size={16} strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => go(2)}
                  className="btn btn-filled mt-6 h-14 w-full rounded-none text-lg"
                >
                  <span className="inline-flex items-center gap-2">
                    {a.recursos.length
                      ? pt
                        ? "Continuar"
                        : "Continue"
                      : pt
                        ? "Não sei, pular"
                        : "Not sure, skip"}
                    <ArrowRight size={20} />
                  </span>
                </button>
              </>
            )}

            {step === 2 && single(VISUAL, "visual", "")}
            {step === 3 && single(PRAZO, "prazo", "")}

            {step === 4 && (
              <div className="flex flex-col items-stretch">
                {speech.supported && (
                  <button
                    type="button"
                    onClick={speech.toggle}
                    aria-pressed={speech.listening}
                    className={`relative mx-auto flex h-28 w-28 items-center justify-center text-surface transition-colors ${speech.listening ? "bg-[#d93025]" : "bg-on-surface"}`}
                  >
                    {speech.listening && !reduce && (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 bg-[#d93025]"
                        animate={{ scale: [1, 1.35], opacity: [0.45, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}
                    {speech.listening ? (
                      <Square size={34} fill="currentColor" />
                    ) : (
                      <Mic size={40} />
                    )}
                    <span className="sr-only">
                      {speech.listening
                        ? pt
                          ? "Parar de gravar"
                          : "Stop"
                        : pt
                          ? "Falar minha ideia"
                          : "Speak my idea"}
                    </span>
                  </button>
                )}
                {speech.supported && (
                  <p
                    className="mt-3 text-center text-lg font-semibold"
                    aria-live="polite"
                  >
                    {speech.listening
                      ? pt
                        ? "Estou ouvindo... toque pra parar"
                        : "Listening... tap to stop"
                      : pt
                        ? "Toque no microfone e fale"
                        : "Tap the microphone and talk"}
                  </p>
                )}
                {speech.error && (
                  <p
                    role="alert"
                    className="mt-2 text-center text-base text-error"
                  >
                    {speechErrorText(speech.error, pt)}
                  </p>
                )}

                <label
                  htmlFor="guided-detalhes"
                  className="mt-6 text-base font-medium"
                >
                  {speech.supported
                    ? pt
                      ? "Ou escreva aqui:"
                      : "Or type here:"
                    : pt
                      ? "Escreva aqui:"
                      : "Type here:"}
                </label>
                <textarea
                  id="guided-detalhes"
                  rows={4}
                  value={
                    speech.interim
                      ? `${a.detalhes} ${speech.interim}`.trim()
                      : a.detalhes
                  }
                  onChange={(e) =>
                    setA((x) => ({ ...x, detalhes: e.target.value }))
                  }
                  maxLength={1500}
                  placeholder={
                    pt
                      ? "Ex.: tenho um salão de beleza e quero que as clientes marquem horário pelo celular."
                      : "E.g.: I run a salon and want clients to book from their phone."
                  }
                  className="mt-2 w-full resize-none border-2 border-outline-variant bg-surface-low p-4 text-lg leading-relaxed outline-none placeholder:text-on-surface-variant focus:border-on-surface/60"
                />

                <button
                  type="button"
                  onClick={finish}
                  className="btn btn-filled mt-6 h-14 w-full rounded-none text-lg"
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles size={20} />
                    {pt ? "Ver meu orçamento" : "See my quote"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => go(step - 1)}
            className="inline-flex h-12 items-center gap-1.5 px-3 text-base font-semibold text-on-surface hover:bg-surface-high"
          >
            <ChevronLeft size={22} />
            {pt ? "Voltar" : "Back"}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => {
            speech.stop();
            trackEvent("orcamento_guiado_pular", { passo: step + 1 });
            onWrite();
          }}
          className="inline-flex h-12 items-center gap-2 px-3 text-base text-on-surface-variant underline-offset-4 hover:text-on-surface hover:underline"
        >
          <PenLine size={18} />
          {pt ? "Prefiro escrever do meu jeito" : "I'd rather type it myself"}
        </button>
      </div>
    </section>
  );
}
