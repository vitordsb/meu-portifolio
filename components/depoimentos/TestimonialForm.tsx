"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, Loader2, Send, Star, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { whatsappHref } from "@/lib/home-links";
import type { TestimonialProject } from "@/lib/testimonials/projects";
import { LIMITS } from "@/lib/testimonials/types";
import TestimonialCard from "./TestimonialCard";

const field =
  "w-full rounded-none border border-outline-variant bg-surface px-4 py-3 text-base outline-none transition focus:border-on-surface focus:ring-2 focus:ring-on-surface/10";

/**
 * Reduz a foto no navegador (lado maior 1200 px, JPEG) antes de subir: foto
 * de celular passa fácil de 4 MB, o limite da rota. Se o navegador não
 * conseguir ler o formato (HEIC no Chrome, por exemplo), manda o original e o
 * servidor tenta.
 */
async function shrink(file: File): Promise<Blob> {
  try {
    const img = await createImageBitmap(file);
    const scale = Math.min(1, 1200 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.86));
    return blob ?? file;
  } catch {
    return file;
  }
}

type Props = {
  /** Link único (cliente verificado). Sem ele, é o formulário aberto. */
  token?: string;
  /** Projeto já definido pelo link. */
  fixedProject?: string | null;
  /** Lista do formulário aberto. */
  projects?: TestimonialProject[];
  initialName?: string;
};

export default function TestimonialForm({ token, fixedProject, projects = [], initialName = "" }: Props) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const [name, setName] = useState(initialName);
  const [role, setRole] = useState("");
  const [project, setProject] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(0);
  const [consent, setConsent] = useState(false);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkUsed, setLinkUsed] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const projectLabel =
    fixedProject ?? (project && project !== "outro" ? projects.find((p) => p.id === project)?.name ?? null : null);
  const quoteLen = quote.trim().length;
  const valid =
    name.trim().length >= LIMITS.name[0] &&
    quoteLen >= LIMITS.quote[0] &&
    quoteLen <= LIMITS.quote[1] &&
    rating > 0 &&
    consent &&
    (token ? true : Boolean(project));

  const pickPhoto = async (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/") && !/\.(heic|heif)$/i.test(file.name)) {
      setError(pt ? "Escolha uma foto (JPG, PNG ou HEIC)." : "Pick a photo (JPG, PNG or HEIC).");
      return;
    }
    const small = await shrink(file);
    if (small.size > LIMITS.photoBytes) {
      setError(pt ? "Essa foto é grande demais. Tente outra." : "That photo is too large. Try another one.");
      return;
    }
    setPhoto(small);
    setPreview(URL.createObjectURL(small));
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setError(null);
    const body = new FormData();
    if (token) body.set("token", token);
    else body.set("project", project);
    body.set("name", name);
    body.set("role", role);
    body.set("quote", quote);
    body.set("rating", String(rating));
    body.set("consent", "sim");
    body.set("site", honeypot.current?.value ?? "");
    if (photo) body.set("photo", photo, "foto.jpg");
    try {
      const res = await fetch("/api/depoimentos", { method: "POST", body });
      if (res.ok) {
        setDone(true);
        window.scrollTo({ top: 0 });
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string; retryAfterMin?: number };
      setLinkUsed(data.error === "link");
      setError(
        data.error === "link"
          ? pt
            ? "Este link já foi usado ou venceu. Peça um novo pelo WhatsApp."
            : "This link was already used or has expired. Ask for a new one on WhatsApp."
          : data.error === "photo"
            ? pt
              ? "Não consegui ler essa foto. Tente outra (JPG ou PNG) ou envie sem foto."
              : "Couldn't read that photo. Try another (JPG or PNG) or send without one."
            : data.error === "rate_limited"
              ? pt
                ? `Muitos envios seguidos. Tente de novo em ${data.retryAfterMin ?? 60} min.`
                : `Too many attempts. Try again in ${data.retryAfterMin ?? 60} min.`
              : data.error === "invalid"
                ? pt
                  ? "Confira os campos: nome completo e depoimento com pelo menos 20 letras, sem links."
                  : "Check the fields: full name and a testimonial of at least 20 characters, no links."
                : pt
                  ? "Não deu pra enviar agora. Tente de novo em alguns minutos."
                  : "Couldn't send right now. Try again in a few minutes.",
      );
    } catch {
      setError(pt ? "Sem conexão. Confira a internet e tente de novo." : "No connection. Check your internet and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="border border-outline-variant bg-surface-low p-6 sm:p-8">
        <CheckCircle2 size={28} aria-hidden />
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
          {pt ? "Obrigado pelo depoimento!" : "Thanks for your testimonial!"}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-on-surface-variant">
          {pt
            ? "Ele já está no site. Se quiser mudar alguma coisa ou tirar do ar, é só chamar no WhatsApp."
            : "It's already live on the site. To change anything or take it down, just message us on WhatsApp."}
        </p>
        <Link
          href="/#depoimentos"
          className="btn btn-filled mt-6 inline-flex h-12 items-center rounded-none px-6 text-base"
        >
          {pt ? "Ver no site" : "See it on the site"}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-12">
      <div className="grid gap-5">
        {/* Campo-isca: fora da tela, robô preenche */}
        <input
          ref={honeypot}
          name="site"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        {!token && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{pt ? "Qual projeto?" : "Which project?"}</span>
            <select required value={project} onChange={(e) => setProject(e.target.value)} className={field}>
              <option value="" disabled>
                {pt ? "Escolha o projeto" : "Choose the project"}
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              <option value="outro">{pt ? "Outro projeto" : "Another project"}</option>
            </select>
          </label>
        )}

        <fieldset>
          <legend className="mb-1.5 block text-sm font-semibold">{pt ? "Sua avaliação" : "Your rating"}</legend>
          <div className="flex gap-1" role="radiogroup" aria-label={pt ? "Avaliação de 1 a 5" : "Rating from 1 to 5"}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} ${n === 1 ? (pt ? "estrela" : "star") : pt ? "estrelas" : "stars"}`}
                onClick={() => setRating(n)}
                className="flex h-12 w-12 items-center justify-center rounded-none border border-outline-variant transition-colors hover:border-on-surface"
              >
                <Star
                  size={22}
                  aria-hidden
                  className={n <= rating ? "fill-on-surface text-on-surface" : "text-on-surface-variant"}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">{pt ? "Seu depoimento" : "Your testimonial"}</span>
          <textarea
            required
            rows={6}
            value={quote}
            maxLength={LIMITS.quote[1]}
            onChange={(e) => setQuote(e.target.value)}
            placeholder={
              pt
                ? "Como era antes? O que mudou? Pra quem você recomendaria?"
                : "What was it like before? What changed? Who would you recommend it to?"
            }
            className={`${field} resize-y`}
          />
          <span className="mt-1 block text-right text-xs text-on-surface-variant">
            {quoteLen}/{LIMITS.quote[1]}
          </span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{pt ? "Nome completo" : "Full name"}</span>
            <input
              required
              autoComplete="name"
              value={name}
              maxLength={LIMITS.name[1]}
              onChange={(e) => setName(e.target.value)}
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">
              {pt ? "Cargo e empresa" : "Role and company"}{" "}
              <span className="font-normal text-on-surface-variant">({pt ? "opcional" : "optional"})</span>
            </span>
            <input
              autoComplete="organization-title"
              value={role}
              maxLength={LIMITS.role[1]}
              onChange={(e) => setRole(e.target.value)}
              placeholder={pt ? "Ex.: Sócia na ArqDoor" : "E.g. Partner at ArqDoor"}
              className={field}
            />
          </label>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-semibold">
            {pt ? "Sua foto" : "Your photo"}{" "}
            <span className="font-normal text-on-surface-variant">({pt ? "opcional" : "optional"})</span>
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.heic,.heif"
            className="sr-only"
            id="foto-depoimento"
            onChange={(e) => pickPhoto(e.target.files?.[0])}
          />
          <div className="flex items-center gap-3">
            <label
              htmlFor="foto-depoimento"
              className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-none border border-outline-variant px-4 text-base transition-colors hover:border-on-surface"
            >
              <Camera size={18} aria-hidden />
              {photo ? (pt ? "Trocar foto" : "Change photo") : pt ? "Escolher foto" : "Choose photo"}
            </label>
            {photo && (
              <button
                type="button"
                onClick={clearPhoto}
                className="inline-flex h-12 items-center gap-1 rounded-none px-3 text-sm text-on-surface-variant hover:text-on-surface"
              >
                <X size={16} aria-hidden />
                {pt ? "Tirar" : "Remove"}
              </button>
            )}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-on-surface-variant">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
          />
          <span>
            {pt
              ? "Autorizo publicar meu nome, cargo, foto, avaliação e este depoimento no site vitordsb.com.br. Posso pedir para tirar quando quiser. Veja a "
              : "I authorize publishing my name, role, photo, rating and this testimonial on vitordsb.com.br. I can ask to remove it at any time. See the "}
            <a
              href="/privacidade#depoimentos"
              target="_blank"
              rel="noopener"
              className="underline underline-offset-2 hover:text-on-surface"
            >
              {pt ? "Política de Privacidade" : "Privacy Policy (in Portuguese)"}
            </a>
            .
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}{" "}
            {linkUsed && (
              <a href={whatsappHref(pt)} target="_blank" rel="noopener noreferrer" className="underline">
                WhatsApp
              </a>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={!valid}
          aria-busy={busy}
          className="btn btn-filled h-12 w-full rounded-none px-6 text-base sm:w-auto sm:justify-self-start"
        >
          <span className="inline-flex items-center gap-2">
            {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {busy ? (pt ? "Enviando..." : "Sending...") : pt ? "Publicar depoimento" : "Publish testimonial"}
          </span>
        </button>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-sm font-semibold">{pt ? "Como vai aparecer no site" : "How it will look"}</p>
        <TestimonialCard
          pt={pt}
          t={{
            name: name.trim() || (pt ? "Seu nome" : "Your name"),
            role: role.trim() || null,
            projectName: projectLabel,
            photoUrl: preview,
            quote:
              quote.trim() ||
              (pt ? "Seu depoimento aparece aqui enquanto você escreve." : "Your testimonial shows up here as you type."),
            rating: rating || 5,
            verified: Boolean(token),
          }}
        />
      </aside>
    </form>
  );
}
