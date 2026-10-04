"use client";

import { forwardRef, useImperativeHandle, type ReactNode } from "react";
import {
  animate,
  motion,
  PresenceContext,
  useIsPresent,
  useMotionValue,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const SETTLE = { type: "spring", stiffness: 420, damping: 40 } as const;

/** O que o deck controla na sessão da vez durante um gesto. */
export type PaneHandle = {
  /** Desloca a sessão junto com o arraste (px, já com resistência). */
  drag: (dx: number) => void;
  /** Gesto não passou do ponto: volta pro lugar com mola. */
  settle: () => void;
  /** "Espiadinha": puxa um pouco pro lado e volta, ensinando o arraste. */
  nudge: () => void;
};

/**
 * Uma sessão do deck. Cada uma tem o próprio `x`: assim ela segue o arraste
 * e, quando troca, sai DO PONTO ONDE FOI SOLTA na direção do gesto, enquanto
 * a próxima entra pelo lado oposto. Nada pula de lugar.
 */
const SlidePane = forwardRef<
  PaneHandle,
  { id: string; label: string; direction: number; children: ReactNode }
>(function SlidePane({ id, label, direction, children }, ref) {
  const x = useMotionValue(0);
  // Saindo: por cima da nova e sem receber clique. Isso fica no style, não na
  // variante de exit: pointerEvents/zIndex no exit travavam o AnimatePresence
  // (a saída nunca concluía e cada sessão visitada ficava montada pra sempre).
  const present = useIsPresent();

  useImperativeHandle(
    ref,
    () => ({
      drag: (dx) => {
        x.stop();
        x.set(dx);
      },
      settle: () => {
        animate(x, 0, SETTLE);
      },
      nudge: () => {
        if (x.get() !== 0) return;
        animate(x, [0, -44, 0], {
          duration: 1.1,
          times: [0, 0.4, 1],
          ease: [EASE, [0.34, 1.56, 0.64, 1]],
        });
      },
    }),
    [x],
  );

  return (
    <motion.section
      id={id}
      aria-label={label}
      custom={direction}
      style={{
        x,
        pointerEvents: present ? "auto" : "none",
        zIndex: present ? 0 : 1,
      }}
      variants={{
        from: (dir: number) => ({ opacity: 0, x: dir * 56 }),
        enter: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.4, ease: EASE },
        },
        exit: (dir: number) => ({
          opacity: 0,
          x: x.get() - dir * 96,
          transition: { duration: 0.32, ease: EASE },
        }),
      }}
      initial="from"
      animate="enter"
      exit="exit"
      // touch-pan-y aqui, não só na raiz: o navegador só olha o touch-action
      // até a área rolável mais próxima. Sem isso, no celular ele assume o
      // gesto lateral, cancela o ponteiro e o arraste entre sessões morre.
      className="absolute inset-0 touch-pan-y overflow-y-auto overscroll-contain"
    >
      {/* O deck usa AnimatePresence initial={false} pra sessão não deslizar ao
        abrir a página. Só que esse "sem animação inicial" vaza por contexto
        pra todo motion de dentro, e o hero (Line/Rise) aparecia parado, tanto
        ao abrir quanto ao voltar das páginas de venda. Cortar o contexto aqui
        isola a regra na sessão; a saída dela não depende dos filhos. */}
      <PresenceContext.Provider value={null}>{children}</PresenceContext.Provider>
    </motion.section>
  );
});

export default SlidePane;
