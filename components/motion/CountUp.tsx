"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Anima de 0 até `value` quando entra na viewport. prefix/suffix livres.
 *
 * Com `startAfter` (segundos), ignora a viewport e começa por tempo: serve pra
 * quem já nasce na tela, como o banner, onde o IntersectionObserver falhava
 * com o número colado no rodapé fixo.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.2,
  startAfter,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  startAfter?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    if (startAfter === undefined) return;
    const t = setTimeout(() => setTimerDone(true), startAfter * 1000);
    return () => clearTimeout(t);
  }, [startAfter]);

  const inView = startAfter === undefined ? seen : timerDone;

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
