"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Ditado por voz com o reconhecimento do próprio navegador (Chrome, Edge,
 * Safari no iPhone e no Mac). O áudio não passa pelo nosso servidor: o
 * navegador devolve o texto. Pensado pra quem prefere falar a digitar, como
 * no áudio do WhatsApp. Firefox não tem: aí `supported` fica false e o botão
 * nem aparece.
 */

type Rec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult:
    | ((e: {
        resultIndex: number;
        results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
      }) => void)
    | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type RecCtor = new () => Rec;

function getCtor(): RecCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecCtor;
    webkitSpeechRecognition?: RecCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type SpeechError = "denied" | "no-speech" | "failed";

export function useSpeech(lang: "pt" | "en", onText: (text: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<SpeechError | null>(null);
  const recRef = useRef<Rec | null>(null);
  const onTextRef = useRef(onText);
  onTextRef.current = onText;

  // Só no navegador (evita diferença entre servidor e cliente)
  useEffect(() => setSupported(getCtor() !== null), []);
  useEffect(() => () => recRef.current?.abort(), []);

  const stop = useCallback(() => recRef.current?.stop(), []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor || recRef.current) return;
    const rec = new Ctor();
    rec.lang = lang === "pt" ? "pt-BR" : "en-US";
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (e) => {
      let finalText = "";
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else live += r[0].transcript;
      }
      if (finalText.trim()) onTextRef.current(finalText.trim());
      setInterim(live);
    };
    rec.onerror = (e) => {
      setError(
        e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "denied"
          : e.error === "no-speech"
            ? "no-speech"
            : e.error === "aborted"
              ? null
              : "failed",
      );
    };
    rec.onend = () => {
      recRef.current = null;
      setListening(false);
      setInterim("");
    };
    recRef.current = rec;
    setError(null);
    setListening(true);
    try {
      rec.start();
    } catch {
      recRef.current = null;
      setListening(false);
      setError("failed");
    }
  }, [lang]);

  const toggle = useCallback(
    () => (recRef.current ? stop() : start()),
    [start, stop],
  );

  return { supported, listening, interim, error, start, stop, toggle };
}

export function speechErrorText(err: SpeechError, pt: boolean) {
  if (err === "denied")
    return pt
      ? "O microfone está bloqueado. Toque no cadeado ao lado do endereço do site e permita o microfone, ou escreva sua ideia."
      : "The microphone is blocked. Tap the lock next to the site address and allow the microphone, or type your idea.";
  if (err === "no-speech")
    return pt
      ? "Não ouvi nada. Toque de novo e fale perto do celular."
      : "I didn't hear anything. Tap again and speak close to the phone.";
  return pt
    ? "Não consegui ouvir agora. Tenta de novo ou escreva."
    : "I couldn't listen right now. Try again or type.";
}
