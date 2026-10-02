"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANDING } from "@/lib/landing-data";
import {
  DECK_SECTIONS,
  SECTION_ANCHORS,
  l,
  type DeckSectionId,
} from "@/lib/deck-content";
import { CursorFollower } from "@/components/motion/CursorFollower";
import AvatarMenu from "./AvatarMenu";
import DeckPagination from "./DeckPagination";
import SearchHint from "@/components/SearchHint";
import SlidePane, { type PaneHandle } from "./SlidePane";
import HeroSlide from "./slides/HeroSlide";
import ExperienceSlide from "./slides/ExperienceSlide";
import SpecialtiesSlide from "./slides/SpecialtiesSlide";
import JourneySlide from "./slides/JourneySlide";

/** Onde um arraste NÃO começa: o que já é clicável ou rola de lado. */
const INTERACTIVE =
  "a, button, input, textarea, select, label, summary, [role='button'], [role='tab'], [data-no-swipe], [contenteditable='true']";
/**
 * No toque, o arraste pode começar em link e botão: no celular eles ocupam
 * boa parte da tela e quem desliza não mira. Um toque simples segue abrindo
 * o link; só um deslize de verdade vira troca de sessão (o click é engolido).
 */
const TOUCH_BLOCK =
  "input, textarea, select, [data-no-swipe], [contenteditable='true']";
/** Arraste que passa disso (ou 20% da tela) troca de sessão ao soltar. */
const DRAG_COMMIT_PX = 160;
/** ...ou um "chute" rápido: >40px a mais de 0,45 px/ms. */
const FLICK_PX = 40;
const FLICK_SPEED = 0.45;
/** Deslize de dois dedos no trackpad: soma de deltaX que troca de sessão. */
const WHEEL_COMMIT = 140;
/** Duração de uma troca (saída 0,32s, entrada 0,4s): trava contra sobreposição. */
const NAV_LOCK_MS = 420;

function overlayOpen() {
  return !!document.querySelector("[role='dialog'], [role='menu']");
}

/** Tecla não troca de sessão quando o foco está digitando ou num overlay. */
function shouldIgnoreKey(e: KeyboardEvent): boolean {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
    return true;
  const el = e.target as HTMLElement | null;
  if (el?.closest("input, textarea, select, [contenteditable='true']"))
    return true;
  return overlayOpen();
}

/** Sessão (e âncora dentro dela) que o hash da URL pede. */
function targetFromHash(): { index: number; anchor: string | null } {
  const id = window.location.hash.replace("#", "");
  const parent = SECTION_ANCHORS[id];
  const sectionId = parent ?? id;
  const i = DECK_SECTIONS.findIndex((s) => s.id === sectionId);
  return { index: i === -1 ? 0 : i, anchor: parent ? id : null };
}

/** Rola a sessão até a âncora depois que ela montou e animou a entrada. */
function scrollToAnchor(anchor: string) {
  setTimeout(() => {
    document
      .getElementById(anchor)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 450);
}

/**
 * A home é um deck: cada sessão ocupa a tela e a paginação do rodapé troca
 * entre elas. Também navegam: setas do teclado, arrastar pro lado (mouse ou
 * dedo, com a sessão acompanhando) e o deslize de dois dedos do trackpad.
 * A roda do mouse (vertical) fica livre pra rolar o conteúdo da sessão.
 */
export default function HomeDeck() {
  const { skills, certificates, projectCount } = LANDING;
  const { language } = useLanguage();
  const pt = language === "pt";
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [dragging, setDragging] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  // Uma alça por sessão montada. Um ref único seria zerado pelo React quando a
  // sessão antiga termina de sair, deixando a nova sem controle de arraste.
  const panes = useRef(new Map<string, PaneHandle>());
  const pane = () => panes.current.get(DECK_SECTIONS[indexRef.current].id);
  const indexRef = useRef(index);
  indexRef.current = index;
  const gesture = useRef<{
    id: number;
    x0: number;
    y0: number;
    t0: number;
    dx: number;
    dragging: boolean;
  } | null>(null);

  const total = DECK_SECTIONS.length;
  const labels = DECK_SECTIONS.map((s) => l(s.label, language));

  // Uma transição por vez. Trocar de novo enquanto a sessão anterior ainda
  // sai (ou a nova ainda entra) deixava o AnimatePresence com sessões presas,
  // invisíveis e montadas pra sempre. Pedido que chega no meio vai pra fila e
  // é aplicado quando a transição termina: 3 cliques rápidos ainda andam 3.
  const lockUntil = useRef(0);
  const queued = useRef<number | null>(null);
  const queueTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= total) return;
      const wait = lockUntil.current - performance.now();
      if (wait > 0) {
        queued.current = next;
        clearTimeout(queueTimer.current);
        queueTimer.current = setTimeout(() => {
          const q = queued.current;
          queued.current = null;
          if (q !== null) goRef.current(q);
        }, wait);
        return;
      }
      if (next === indexRef.current) return;
      lockUntil.current = performance.now() + NAV_LOCK_MS;
      setDirection(next > indexRef.current ? 1 : -1);
      setIndex(next);
      indexRef.current = next;
      // replaceState: o "voltar" do navegador sai do site em vez de rebobinar sessão
      const id = DECK_SECTIONS[next].id;
      const url = next === 0 ? window.location.pathname : `#${id}`;
      window.history.replaceState(null, "", url);
    },
    [total],
  );
  const goRef = useRef(go);
  goRef.current = go;

  /** Anda N sessões a partir de onde a pessoa VAI estar (conta a fila). */
  const step = useCallback(
    (delta: number) => go((queued.current ?? indexRef.current) + delta),
    [go],
  );

  // Link direto (/#experiencia, /#tecnologias) abre na sessão certa
  useEffect(() => {
    const first = targetFromHash();
    setIndex(first.index);
    if (first.anchor) scrollToAnchor(first.anchor);
    const onHash = () => {
      const t = targetFromHash();
      go(t.index);
      if (t.anchor) scrollToAnchor(t.anchor);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (shouldIgnoreKey(e)) return;
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  /** Resistência: nas pontas (não há pra onde ir) a sessão quase não sai. */
  const resist = useCallback(
    (dx: number) => {
      const i = indexRef.current;
      const blocked = (i === 0 && dx > 0) || (i === total - 1 && dx < 0);
      return dx * (blocked ? 0.16 : 0.55);
    },
    [total],
  );

  // ── Convite ao arraste na home ────────────────────────────────────────────
  // Depois que o banner entra, a home dá um puxão leve pro lado e volta, como
  // se alguém tivesse começado a arrastar. No máximo 2 vezes e só enquanto a
  // pessoa não mexeu em nada: quem já interagiu não precisa de dica.
  const interacted = useRef(false);
  useEffect(() => {
    const mark = () => (interacted.current = true);
    const opts = { capture: true, passive: true } as const;
    window.addEventListener("pointerdown", mark, opts);
    window.addEventListener("wheel", mark, opts);
    window.addEventListener("keydown", mark, opts);
    return () => {
      window.removeEventListener("pointerdown", mark, opts);
      window.removeEventListener("wheel", mark, opts);
      window.removeEventListener("keydown", mark, opts);
    };
  }, []);

  useEffect(() => {
    if (index !== 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const peek = () => {
      if (interacted.current || gesture.current || indexRef.current !== 0)
        return;
      pane()?.nudge();
    };
    const timers = [setTimeout(peek, 3400), setTimeout(peek, 10000)];
    return () => timers.forEach(clearTimeout);
    // pane() só lê refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // ── Arrastar (mouse e toque) ──────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || !e.isPrimary || overlayOpen()) return;
    const block = e.pointerType === "touch" ? TOUCH_BLOCK : INTERACTIVE;
    if ((e.target as HTMLElement).closest(block)) return;
    gesture.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      t0: performance.now(),
      dx: 0,
      dragging: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g || e.pointerId !== g.id) return;
    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;
    if (!g.dragging) {
      // Gesto vertical é rolagem (ou seleção de texto): não é com a gente
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        gesture.current = null;
        return;
      }
      if (Math.abs(dx) < 8) return;
      g.dragging = true;
      // Captura o ponteiro pra o arraste seguir mesmo saindo da janela
      try {
        rootRef.current?.setPointerCapture(e.pointerId);
      } catch {}
      window.getSelection()?.removeAllRanges();
      setDragging(true);
    }
    g.dx = dx;
    pane()?.drag(resist(dx));
  };

  const endDrag = (cancelled: boolean) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g?.dragging) return;
    setDragging(false);

    // O navegador ainda dispara um click ao soltar: não pode abrir nada
    const swallow = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
    };
    window.addEventListener("click", swallow, { capture: true, once: true });
    setTimeout(() => window.removeEventListener("click", swallow, true), 0);

    const speed = Math.abs(g.dx) / (performance.now() - g.t0);
    const far =
      Math.abs(g.dx) > Math.min(DRAG_COMMIT_PX, window.innerWidth * 0.2);
    const flick = Math.abs(g.dx) > FLICK_PX && speed > FLICK_SPEED;
    const next = indexRef.current + (g.dx < 0 ? 1 : -1);
    if (!cancelled && (far || flick) && next >= 0 && next < total)
      step(g.dx < 0 ? 1 : -1);
    else pane()?.settle();
  };

  // ── Deslize de dois dedos no trackpad ─────────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let acc = 0;
    let lockUntil = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;

    const onWheel = (e: WheelEvent) => {
      // Rolagem vertical (roda do mouse incluída) segue rolando a sessão
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.2) return;
      if (overlayOpen()) return;
      // Sem isso o Chrome usa o gesto pra "voltar página" e tira a pessoa do site
      e.preventDefault();

      const now = performance.now();
      // A inércia do trackpad continua mandando eventos depois da troca:
      // engole até eles pararem, senão um deslize pularia várias sessões
      if (now < lockUntil) {
        lockUntil = now + 180;
        return;
      }

      acc += e.deltaX;
      pane()?.drag(resist(-acc));
      if (idle) clearTimeout(idle);

      if (Math.abs(acc) > WHEEL_COMMIT) {
        const dir = acc > 0 ? 1 : -1;
        const next = indexRef.current + dir;
        acc = 0;
        lockUntil = now + 400;
        if (next >= 0 && next < total) step(dir);
        else pane()?.settle();
        return;
      }
      idle = setTimeout(() => {
        acc = 0;
        pane()?.settle();
      }, 160);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      if (idle) clearTimeout(idle);
    };
  }, [step, resist, total]);

  const common = { title: labels[index] };
  const slides: Record<DeckSectionId, ReactNode> = {
    inicio: (
      <HeroSlide
        projectCount={projectCount}
        courseCount={certificates.length}
      />
    ),
    experiencia: <ExperienceSlide {...common} />,
    especializacoes: <SpecialtiesSlide skills={skills} {...common} />,
    trajetoria: <JourneySlide certificates={certificates} {...common} />,
  };
  const section = DECK_SECTIONS[index];

  return (
    <MotionConfig reducedMotion="user">
      <CursorFollower />
      <div
        ref={rootRef}
        // pan-y: o dedo rola na vertical; o arraste lateral vem pra cá
        className={`fixed inset-0 touch-pan-y overflow-hidden bg-surface text-on-surface ${
          dragging ? "cursor-grabbing select-none" : ""
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => endDrag(false)}
        onPointerCancel={() => endDrag(true)}
      >
        {/* Sem mode="wait": a sessão nova monta no mesmo commit da troca e a
            antiga sai por cima. Esperar a saída fazia a montagem (pesada no
            banner) cair no meio da animação da paginação e engasgar. */}
        <AnimatePresence initial={false} custom={direction}>
          <SlidePane
            key={section.id}
            ref={(h) => {
              if (h) panes.current.set(section.id, h);
              else panes.current.delete(section.id);
            }}
            id={section.id}
            label={labels[index]}
            direction={direction}
          >
            {slides[section.id]}
          </SlidePane>
        </AnimatePresence>

        {/* Degradê do topo: o conteúdo que rola some por baixo da busca, igual
            ao rodapé faz com a paginação */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-16 bg-gradient-to-b from-surface from-40% to-transparent sm:h-24"
        />

        {/* Busca no topo, centralizada (no celular, lupa à direita). Completa só
            no Início; nas outras sessões encolhe pro atalho, animando. */}
        <div className="pointer-events-none absolute right-4 top-4 z-40 flex sm:inset-x-0 sm:top-6 sm:justify-center [&>*]:pointer-events-auto">
          <SearchHint variant="hero" expanded={index === 0} delay={1.2} />
        </div>

        <p className="sr-only" aria-live="polite">
          {pt
            ? `Sessão ${index + 1} de ${total}: ${labels[index]}`
            : `Section ${index + 1} of ${total}: ${labels[index]}`}
        </p>
      </div>

      {/* Rodapé: avatar/menu à esquerda, paginação no centro. Fixo e sem
          animação de entrada: é navegação, tem que estar lá desde o
          primeiro frame. O degradê esconde o conteúdo que rola por baixo. */}
      <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-surface from-60% to-transparent pb-3 pt-6 sm:pb-6 sm:pt-10">
        <div className="pointer-events-auto mx-auto grid max-w-[96rem] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:grid-cols-[1fr_auto_1fr] sm:px-8 lg:px-20">
          <AvatarMenu />
          <div className="flex justify-center">
            <DeckPagination
              current={index}
              labels={labels}
              onChange={go}
              language={language}
            />
          </div>
          {/* Coluna da direita vazia: equilibra o grid pra paginação ficar no centro */}
          <span />
        </div>
      </footer>
    </MotionConfig>
  );
}
