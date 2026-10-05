"use client";

import { useCallback, useEffect, useState } from "react";
import { FONT_SCALE_KEY as KEY } from "./font-script";

/**
 * Tamanho da letra do site (botão "Aa"): multiplica a escala do <html>
 * (`--font-scale` em globals.css). Tudo é em rem, então o site inteiro cresce
 * junto. O fontScript do layout aplica a escolha salva antes da primeira
 * pintura; aqui só lê, troca e avisa os outros botões.
 */

export const FONT_SCALES = [1, 1.125, 1.25] as const;
export const FONT_LABELS = {
  pt: ["Normal", "Grande", "Maior"],
  en: ["Normal", "Large", "Larger"],
} as const;

const EVENT = "font-scale-change";

function currentIndex() {
  const v = parseFloat(
    document.documentElement.style.getPropertyValue("--font-scale") || "1",
  );
  const i = FONT_SCALES.indexOf(v as (typeof FONT_SCALES)[number]);
  return i < 0 ? 0 : i;
}

function apply(i: number) {
  const v = FONT_SCALES[i];
  const root = document.documentElement;
  if (v === 1) root.style.removeProperty("--font-scale");
  else root.style.setProperty("--font-scale", String(v));
  try {
    if (v === 1) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, String(v));
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useFontScale() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const sync = () => setIndex(currentIndex());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  const cycle = useCallback(() => apply((currentIndex() + 1) % FONT_SCALES.length), []);
  return { index, cycle };
}
