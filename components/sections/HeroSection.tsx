"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import profilePic from "@/app/(public)/images/vitu.jpeg";

interface Particle { x: number; y: number; size: number; speedX: number; speedY: number; }

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3,
    }));
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.fillStyle = "oklch(0.50 0.22 235 / 0.25)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); cancelAnimationFrame(animId); };
  }, []);

  const stats = [
    { value: "+4", label: t("hero.stats.years") },
    { value: "15+", label: t("hero.stats.projects") },
    { value: "50+", label: t("hero.stats.certs") },
  ];

  const clientNames = ["ZUPTOS", "ARQDOOR", "MTCPROP", "EGP", "FLORENZA", "ZYNTA"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 lg:pt-8 pb-12">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      <div className="relative z-10 container">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 animate-fade-in">

          {/* ── Texto ── */}
          <div className="flex-1 text-center md:text-left">
            <span className="text-accent font-mono text-sm font-bold mb-4 block tracking-widest">
              {t("hero.tag")}
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 whitespace-pre-line">
              {t("hero.name")}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              {t("hero.description")}
            </p>
            <div className="flex gap-4 flex-wrap justify-center md:justify-start">
              <a href="/projects" className="btn-brutalist-accent px-6 py-3 text-sm">
                {t("hero.cta1")}
              </a>
              <a href="/contact" className="btn-brutalist-outline px-6 py-3 text-sm">
                {t("hero.cta2")}
              </a>
            </div>
          </div>

          {/* ── Foto ── */}
          <div className="shrink-0">
            <div className="relative w-60 h-60 md:w-80 md:h-80">
              {/* sombra deslocada estilo brutalist */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-accent" />
              <div className="relative w-full h-full border-4 border-foreground overflow-hidden">
                <Image
                  src={profilePic}
                  alt="Vitor de Souza Barreto"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── Stats (compactos, alinhados à esquerda) ── */}
        <div className="mt-10 md:mt-12 flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border border-border bg-background/60 backdrop-blur-sm px-4 py-3 hover:border-accent transition flex items-baseline gap-2 min-w-[160px]"
            >
              <p className="font-black text-2xl text-accent leading-none">
                {s.value}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Faixa de clientes ── */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-border">
          <p className="text-[10px] font-mono text-muted-foreground tracking-widest mb-6 text-center md:text-left">
            {t("hero.clients")}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-y-4">
            {clientNames.map((name, i) => (
              <div key={name} className="flex items-center">
                <span className="font-black text-base md:text-lg tracking-[0.15em] text-muted-foreground/60 hover:text-accent transition cursor-default">
                  {name}
                </span>
                {i < clientNames.length - 1 && (
                  <span className="hidden md:inline mx-6 lg:mx-8 text-muted-foreground/30 select-none">
                    ·
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-float hidden md:block">
        <ChevronDown size={24} className="text-accent" />
      </div>
    </section>
  );
}
