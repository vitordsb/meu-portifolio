"use client";

import { Printer, Mail, MessageCircle, Linkedin, Github, Globe } from "lucide-react";
import type { Project, Skill, Certificate } from "@/drizzle/schema";
import { aboutContent } from "@/lib/portfolio-data";

// CV print-friendly. Dados vêm do banco — refletem o que está editado em /admin.
// Bio + formação continuam em portfolio-data (textos editoriais, não tem CRUD).

interface CVProps {
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
}

export default function CVDocument({ projects, skills, certificates }: CVProps) {
  const skillsByCat = skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category || "Outros";
    (acc[cat] ??= []).push(s.title);
    return acc;
  }, {});

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .cv-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 24px 32px !important;
          }
          .cv-section { break-inside: avoid; }
        }
        @page { size: A4; margin: 12mm; }
      `}</style>

      {/* Toolbar — escondida na impressão */}
      <div className="no-print sticky top-0 z-10 bg-background border-b border-border lg:pt-0">
        <div className="container py-4 flex items-center justify-between gap-4 pt-20 lg:pt-4">
          <div>
            <p className="text-[10px] font-mono text-accent tracking-widest">
              [ CURRÍCULO ]
            </p>
            <p className="text-xs text-muted-foreground">
              Gerado em tempo real a partir do banco. Salve como PDF pelo navegador.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="btn-brutalist-accent inline-flex items-center gap-2 px-5 py-2 text-sm"
          >
            <Printer size={16} />
            IMPRIMIR / PDF
          </button>
        </div>
      </div>

      {/* Documento A4 */}
      <main className="bg-muted/30 min-h-screen py-8 print:py-0 print:bg-white">
        <article
          className="cv-page mx-auto bg-background border border-border shadow-sm max-w-[210mm] p-12 print:max-w-none print:border-0 print:shadow-none"
          style={{ minHeight: "297mm" }}
        >
          {/* Header */}
          <header className="border-b-2 border-foreground pb-6 mb-8 cv-section">
            <h1 className="text-4xl font-extrabold tracking-tighter leading-none mb-1">
              VITOR DE SOUZA BARRETO
            </h1>
            <p className="text-sm font-mono text-accent tracking-widest mt-2 mb-4">
              UX ENGINEER · FRONT-END · FULL-STACK
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail size={11} className="text-accent" />
                vitordsb2019@gmail.com
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={11} className="text-accent" />
                +55 11 93957-2807
              </div>
              <div className="flex items-center gap-2">
                <Globe size={11} className="text-accent" />
                Cotia/SP, Brasil · GMT-3
              </div>
              <div className="flex items-center gap-2">
                <Linkedin size={11} className="text-accent" />
                linkedin.com/in/vitordsb
              </div>
              <div className="flex items-center gap-2">
                <Github size={11} className="text-accent" />
                github.com/vitordsb
              </div>
            </div>
          </header>

          {/* Resumo */}
          <section className="mb-8 cv-section">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-accent border-b border-border pb-1 mb-3">
              Resumo
            </h2>
            {aboutContent.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[11px] leading-relaxed text-foreground/85 mb-2"
              >
                {p}
              </p>
            ))}
          </section>

          {/* Stack / Skills agrupadas */}
          {skills.length > 0 && (
            <section className="mb-8 cv-section">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-accent border-b border-border pb-1 mb-3">
                Stack &amp; Tecnologias ({skills.length})
              </h2>
              <div className="space-y-1.5">
                {Object.entries(skillsByCat).map(([cat, items]) => (
                  <div key={cat} className="flex gap-3 text-[11px]">
                    <span className="font-bold text-foreground/80 shrink-0 min-w-[120px]">
                      {cat}:
                    </span>
                    <span className="text-foreground/70">{items.join(" · ")}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experiência */}
          <section className="mb-8 cv-section">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-accent border-b border-border pb-1 mb-3">
              Experiência profissional
            </h2>
            <div className="space-y-4">
              {aboutContent.experience.map((exp) => (
                <div key={exp.company}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-sm">{exp.role}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-[11px] text-accent font-bold mb-1">
                    {exp.company}
                  </p>
                  <p className="text-[11px] text-foreground/75 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Projetos em destaque */}
          {featuredProjects.length > 0 && (
            <section className="mb-8 cv-section">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-accent border-b border-border pb-1 mb-3">
                Projetos em destaque ({featuredProjects.length})
              </h2>
              <div className="space-y-3">
                {featuredProjects.map((w) => {
                  const tags = Array.isArray(w.tags) ? w.tags : [];
                  return (
                    <div key={w.id}>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-bold text-sm">{w.title}</h3>
                        {w.liveLink && (
                          <span className="text-[10px] font-mono text-accent">
                            {w.liveLink.replace(/^https?:\/\//, "")}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground mb-1">
                        {w.category} · {w.company}
                        {w.period && <> · {w.period}</>}
                      </p>
                      <p className="text-[11px] text-foreground/75 leading-relaxed mb-1">
                        {w.description}
                      </p>
                      {tags.length > 0 && (
                        <p className="text-[10px] text-muted-foreground italic">
                          Stack: {tags.join(" · ")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Outros trabalhos */}
          {otherProjects.length > 0 && (
            <section className="mb-8 cv-section">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-accent border-b border-border pb-1 mb-3">
                Outros trabalhos ({otherProjects.length})
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
                {otherProjects.map((w) => (
                  <div key={w.id} className="flex gap-2">
                    <span className="font-bold shrink-0">{w.title}</span>
                    <span className="text-muted-foreground">— {w.category}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formação */}
          <section className="mb-8 cv-section">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-accent border-b border-border pb-1 mb-3">
              Formação
            </h2>
            <div className="space-y-3">
              {aboutContent.education.map((ed) => (
                <div key={ed.degree}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-sm">{ed.degree}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {ed.period}
                    </span>
                  </div>
                  <p className="text-[11px] text-accent">{ed.school}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Certificados */}
          {certificates.length > 0 && (
            <section className="cv-section">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-accent border-b border-border pb-1 mb-3">
                Certificações ({certificates.length})
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10px]">
                {certificates.map((c) => (
                  <div key={c.id} className="text-foreground/75">
                    <span className="font-bold">{c.name}</span>
                    {c.description && (
                      <span className="text-muted-foreground">
                        {" "}— {c.description.split(" — ")[0]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    </>
  );
}
