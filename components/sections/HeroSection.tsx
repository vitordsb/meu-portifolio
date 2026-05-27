"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TextReveal } from "@/components/motion/TextReveal";
import { CountUp } from "@/components/motion/CountUp";
import { Eyebrow } from "@/components/Eyebrow";
import profilePic from "@/app/(public)/images/vitu.jpeg";

interface Particle { x: number; y: number; size: number; speedX: number; speedY: number; }

// Arredonda pra baixo no múltiplo dado (default 10).
// Ex: 34 → 30, 78 → 70, 7 → 0 (mas mostramos "0+" só se realmente vazio).
function roundDownTo(n: number, step = 10): number {
  return Math.max(0, Math.floor(n / step) * step);
}

interface HeroSectionProps {
  certCount?: number;
  projectCount?: number;
}

export default function HeroSection({ certCount = 0, projectCount = 0 }: HeroSectionProps) {
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

  // Stats dinâmicos (animam com CountUp ao entrar na viewport):
  //   - Projetos: contagem exata (+1 a cada novo projeto). Ex: 15+, 16+, 17+
  //   - Certificados: arredonda em múltiplos de 10. Ex: 30+, 50+, 70+
  // Fallback (0): mostra placeholder pra não exibir "0+".
  const projectsNum = projectCount > 0 ? projectCount : 15;
  const certsNum = certCount > 0 ? roundDownTo(certCount, 10) : 50;

  const stats = [
    { prefix: "+", value: 4, suffix: "", label: t("hero.stats.years") },
    { prefix: "", value: projectsNum, suffix: "+", label: t("hero.stats.projects") },
    { prefix: "", value: certsNum, suffix: "+", label: t("hero.stats.certs") },
  ];

  const nameLines = t("hero.name").split("\n");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 lg:pt-8 pb-12">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      <div className="relative z-10 container">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 animate-fade-in">

          {/* ── Texto ── */}
          <div className="flex-1 text-center md:text-left">
            <Eyebrow className="mb-4">{t("hero.tag")}</Eyebrow>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
              <TextReveal lines={nameLines} delay={0.1} />
            </h1>
            <motion.p
              className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {t("hero.description")}
            </motion.p>
            <motion.div
              className="flex gap-4 flex-wrap justify-center md:justify-start"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
            >
              <a href="/projects" className="btn-brutalist-accent px-6 py-3 text-sm inline-block">
                {t("hero.cta1")}
              </a>
              <a href="/contact" className="btn-brutalist-outline px-6 py-3 text-sm inline-block">
                {t("hero.cta2")}
              </a>
            </motion.div>
          </div>

          {/* ── Foto ── */}
          <div className="shrink-0">
            <div className="relative w-60 h-60 md:w-80 md:h-80">
              {/* glow suave accent atrás da foto */}
              <div className="absolute -inset-3 rounded-[2rem] bg-accent/15 blur-2xl" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden ring-1 ring-border shadow-xl">
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
              className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-sm px-5 py-3.5 hover:border-accent/60 hover:shadow-md transition-all flex items-baseline gap-2 min-w-[160px]"
            >
              <CountUp
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                className="font-extrabold text-2xl text-accent leading-none"
              />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>

      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-float hidden md:block">
        <ChevronDown size={24} className="text-accent" />
      </div>
    </section>
  );
}
