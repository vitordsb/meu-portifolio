"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { whatsappHref } from "@/lib/home-links";
import PageHeader from "@/components/payments/PageHeader";
import type { TestimonialProject } from "@/lib/testimonials/projects";
import TestimonialForm from "./TestimonialForm";

/**
 * Página do depoimento. Três estados:
 * - `open`: formulário aberto (/depoimento), a pessoa escolhe o projeto;
 * - `link`: link único válido, projeto já marcado;
 * - `invalid`: link usado, vencido ou inventado. Não diz qual dos casos.
 */
export default function TestimonialPage(
  props:
    | { mode: "open"; projects: TestimonialProject[] }
    | { mode: "link"; token: string; projectName: string | null; name?: string }
    | { mode: "invalid" }
    | { mode: "unavailable" },
) {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <PageHeader />
      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10 sm:px-8 sm:pt-16 lg:px-12">
        {props.mode === "invalid" || props.mode === "unavailable" ? (
          <div className="max-w-xl">
            <h1 className="text-[clamp(2rem,7vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
              {props.mode === "invalid"
                ? pt
                  ? "Este link não vale mais"
                  : "This link is no longer valid"
                : pt
                  ? "Depoimentos fora do ar agora"
                  : "Testimonials are unavailable right now"}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
              {props.mode === "invalid"
                ? pt
                  ? "Ele já foi usado ou passou do prazo. Me chama no WhatsApp que eu mando outro."
                  : "It was already used or has expired. Message me on WhatsApp and I'll send a new one."
                : pt
                  ? "Tente de novo daqui a pouco ou mande o seu depoimento pelo WhatsApp."
                  : "Try again shortly or send your testimonial on WhatsApp."}
            </p>
            <a
              href={whatsappHref(pt)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-filled mt-8 inline-flex h-12 items-center gap-2 rounded-none px-6 text-base"
            >
              <MessageCircle size={18} />
              {pt ? "Falar no WhatsApp" : "Message on WhatsApp"}
            </a>
          </div>
        ) : (
          <>
            <h1 className="max-w-3xl text-[clamp(2rem,7vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              {props.mode === "link" && props.projectName
                ? pt
                  ? `Como foi o projeto ${props.projectName}?`
                  : `How was the ${props.projectName} project?`
                : pt
                  ? "Avalie o seu projeto"
                  : "Rate your project"}
            </h1>
            <p className="mb-10 mt-4 max-w-xl text-lg leading-relaxed text-on-surface-variant">
              {pt
                ? "Leva uns 2 minutos. A prévia mostra como o seu depoimento vai ficar no site antes de enviar."
                : "Takes about 2 minutes. The preview shows how your testimonial will look on the site before you send it."}
            </p>
            {props.mode === "link" ? (
              <TestimonialForm token={props.token} fixedProject={props.projectName} initialName={props.name} />
            ) : (
              <TestimonialForm projects={props.projects} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
