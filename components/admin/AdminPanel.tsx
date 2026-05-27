"use client";

import { useState, useTransition, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, LogOut, X } from "lucide-react";
import { toast } from "sonner";
import type { Project, Certificate, Skill, FreelanceWork, TimelineEvent, User } from "@/drizzle/schema";
import {
  createProject, updateProject, deleteProject,
  createCertificate, updateCertificate, deleteCertificate,
  createSkill, updateSkill, deleteSkill,
  createTimelineEvent, updateTimelineEvent, deleteTimelineEvent,
  logout,
} from "@/lib/actions";
import TagSelector from "./TagSelector";

type Tab = "projects" | "certificates" | "skills" | "timeline" | "analytics";

type ProjectForm = {
  title: string; company: string; description: string; category: string;
  slug: string; period: string; featured: boolean;
  coverImageUrl: string; liveLink: string; repositoryLink: string; tags: string[];
};
type CertForm = { name: string; description: string; category: string; link: string; tags: string[] };
type SkillForm = {
  title: string; category: string; iconUrl: string;
  level: string; projectSlugs: string[];
};
type TimelineForm = {
  dateLabel: string; sortDate: string; title: string;
  description: string; category: string; icon: string;
};

const emptyProject: ProjectForm = {
  title: "", company: "", description: "", category: "",
  slug: "", period: "", featured: false,
  coverImageUrl: "", liveLink: "", repositoryLink: "", tags: [],
};
const emptyCert: CertForm = { name: "", description: "", category: "", link: "", tags: [] };
const emptySkill: SkillForm = { title: "", category: "", iconUrl: "", level: "3", projectSlugs: [] };
const emptyTimeline: TimelineForm = { dateLabel: "", sortDate: "", title: "", description: "", category: "", icon: "" };

interface Props {
  user: User;
  initialProjects: Project[];
  initialCertificates: Certificate[];
  initialSkills: Skill[];
  initialFreelance: FreelanceWork[]; // mantido por compat — não renderiza mais aba
  initialTimeline: TimelineEvent[];
}

export default function AdminPanel({ user, initialProjects, initialCertificates, initialSkills, initialTimeline }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  // showForm = true only for NEW items (top form). Editing happens inline.
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProject);
  const [certForm, setCertForm] = useState<CertForm>(emptyCert);
  const [skillForm, setSkillForm] = useState<SkillForm>(emptySkill);
  const [timelineForm, setTimelineForm] = useState<TimelineForm>(emptyTimeline);

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      try { await fn(); router.refresh(); }
      catch (e) { toast.error(e instanceof Error ? e.message : "Erro"); }
    });

  const openNew = () => {
    setEditingId(null);
    setProjectForm(emptyProject); setCertForm(emptyCert);
    setSkillForm(emptySkill);
    setTimelineForm(emptyTimeline);
    setShowNewForm(true);
  };

  const closeForm = () => {
    setShowNewForm(false);
    setEditingId(null);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "projects", label: "PROJETOS / AUTÔNOMO" },
    { id: "certificates", label: "CERTIFICADOS" },
    { id: "skills", label: "SKILLS" },
    { id: "timeline", label: "TIMELINE" },
    { id: "analytics", label: "ANALYTICS" },
  ];

  const f = (placeholder: string, value: string, onChange: (v: string) => void, type = "text") => (
    <input type={type} placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-border p-3 font-medium bg-background w-full text-sm focus:border-accent outline-none" />
  );
  const a = (placeholder: string, value: string, onChange: (v: string) => void) => (
    <textarea placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
      className="border border-border p-3 font-medium bg-background w-full text-sm h-24 resize-none focus:border-accent outline-none" />
  );

  // ── Form bodies (reused for top "new" form and inline "edit" form) ──────────

  const ProjectFormBody = ({ isNew }: { isNew: boolean }) => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const d = {
        title: projectForm.title,
        company: projectForm.company,
        description: projectForm.description,
        category: projectForm.category,
        slug: projectForm.slug || undefined,
        period: projectForm.period || undefined,
        featured: projectForm.featured,
        coverImageUrl: projectForm.coverImageUrl || undefined,
        liveLink: projectForm.liveLink || undefined,
        repositoryLink: projectForm.repositoryLink || undefined,
        tags: projectForm.tags.length ? projectForm.tags : undefined,
      };
      run(() => isNew ? createProject(d) : updateProject(editingId!, d));
      closeForm(); if (isNew) setProjectForm(emptyProject);
    }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {f("Título *", projectForm.title, (v) => setProjectForm((p) => ({ ...p, title: v })))}
        {f("Empresa / Cliente *", projectForm.company, (v) => setProjectForm((p) => ({ ...p, company: v })))}
        {f("Categoria * (SaaS, Landing Page, Marketplace…)", projectForm.category, (v) => setProjectForm((p) => ({ ...p, category: v })))}
        {f("Slug (ex: arqdoor) — usado pra referência de skills", projectForm.slug, (v) => setProjectForm((p) => ({ ...p, slug: v })))}
        {f("Período (ex: Abr/2025 — Hoje)", projectForm.period, (v) => setProjectForm((p) => ({ ...p, period: v })))}
        {f("URL da Imagem de Capa", projectForm.coverImageUrl, (v) => setProjectForm((p) => ({ ...p, coverImageUrl: v })))}
        {f("Link do Site (público)", projectForm.liveLink, (v) => setProjectForm((p) => ({ ...p, liveLink: v })), "url")}
        {f("Link do Repositório", projectForm.repositoryLink, (v) => setProjectForm((p) => ({ ...p, repositoryLink: v })), "url")}
      </div>
      {a("Descrição *", projectForm.description, (v) => setProjectForm((p) => ({ ...p, description: v })))}
      <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
        <input
          type="checkbox"
          checked={projectForm.featured}
          onChange={(e) => setProjectForm((p) => ({ ...p, featured: e.target.checked }))}
          className="w-4 h-4 accent-accent"
        />
        DESTAQUE (aparece na home + topo da /autonomo)
      </label>
      <TagSelector label="STACK / TAGS" placeholder="Ex: React, TypeScript…" selected={projectForm.tags} onChange={(tags) => setProjectForm((p) => ({ ...p, tags }))} />
      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="btn-brutalist-accent px-5 py-2 text-sm">{isPending ? "SALVANDO…" : "SALVAR"}</button>
        <button type="button" onClick={closeForm} className="btn-brutalist-outline px-5 py-2 text-sm">CANCELAR</button>
      </div>
    </form>
  );

  const CertFormBody = ({ isNew }: { isNew: boolean }) => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const d = { name: certForm.name, category: certForm.category, description: certForm.description || undefined, link: certForm.link || undefined, tags: certForm.tags.length ? certForm.tags : undefined };
      run(() => isNew ? createCertificate(d) : updateCertificate(editingId!, d));
      closeForm(); if (isNew) setCertForm(emptyCert);
    }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {f("Nome *", certForm.name, (v) => setCertForm((p) => ({ ...p, name: v })))}
        {f("Categoria *", certForm.category, (v) => setCertForm((p) => ({ ...p, category: v })))}
        {f("Link (opcional)", certForm.link, (v) => setCertForm((p) => ({ ...p, link: v })), "url")}
      </div>
      {a("Descrição", certForm.description, (v) => setCertForm((p) => ({ ...p, description: v })))}
      <TagSelector label="TAGS" placeholder="Ex: Cloud, AWS…" selected={certForm.tags} onChange={(tags) => setCertForm((p) => ({ ...p, tags }))} />
      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="btn-brutalist-accent px-5 py-2 text-sm">{isPending ? "SALVANDO…" : "SALVAR"}</button>
        <button type="button" onClick={closeForm} className="btn-brutalist-outline px-5 py-2 text-sm">CANCELAR</button>
      </div>
    </form>
  );

  const SkillFormBody = ({ isNew }: { isNew: boolean }) => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const d = {
        title: skillForm.title,
        category: skillForm.category || undefined,
        iconUrl: skillForm.iconUrl || undefined,
        level: parseInt(skillForm.level) || 3,
        projectSlugs: skillForm.projectSlugs.length ? skillForm.projectSlugs : undefined,
      };
      run(() => isNew ? createSkill(d) : updateSkill(editingId!, d));
      closeForm(); if (isNew) setSkillForm(emptySkill);
    }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {f("Título *", skillForm.title, (v) => setSkillForm((p) => ({ ...p, title: v })))}
        {f("Categoria", skillForm.category, (v) => setSkillForm((p) => ({ ...p, category: v })))}
        {f("URL do Ícone (ex: https://cdn.simpleicons.org/react)", skillForm.iconUrl, (v) => setSkillForm((p) => ({ ...p, iconUrl: v })))}
        {f("Nível (1=básico, 5=especialista)", skillForm.level, (v) => setSkillForm((p) => ({ ...p, level: v })), "number")}
      </div>
      <TagSelector
        label="PROJETOS ONDE USA (slugs — ex: arqdoor, zuptos)"
        placeholder="Digite o slug do projeto…"
        selected={skillForm.projectSlugs}
        onChange={(slugs) => setSkillForm((p) => ({ ...p, projectSlugs: slugs }))}
      />
      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="btn-brutalist-accent px-5 py-2 text-sm">{isPending ? "SALVANDO…" : "SALVAR"}</button>
        <button type="button" onClick={closeForm} className="btn-brutalist-outline px-5 py-2 text-sm">CANCELAR</button>
      </div>
    </form>
  );

  const TimelineFormBody = ({ isNew }: { isNew: boolean }) => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const d = {
        dateLabel: timelineForm.dateLabel,
        sortDate: timelineForm.sortDate,
        title: timelineForm.title,
        description: timelineForm.description || undefined,
        category: timelineForm.category || undefined,
        icon: timelineForm.icon || undefined,
      };
      run(() => isNew ? createTimelineEvent(d) : updateTimelineEvent(editingId!, d));
      closeForm(); if (isNew) setTimelineForm(emptyTimeline);
    }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {f("Data de exibição * (ex: Ago/2023, 2024, Jan/2026, Hoje)", timelineForm.dateLabel, (v) => setTimelineForm((p) => ({ ...p, dateLabel: v })))}
        {f("Data de ordenação * (YYYY-MM-DD, ex: 2023-08-01)", timelineForm.sortDate, (v) => setTimelineForm((p) => ({ ...p, sortDate: v })))}
        {f("Título *", timelineForm.title, (v) => setTimelineForm((p) => ({ ...p, title: v })))}
        {f("Categoria (Carreira / Educação / Cliente / Marco)", timelineForm.category, (v) => setTimelineForm((p) => ({ ...p, category: v })))}
        {f("Ícone Lucide (ex: Briefcase, GraduationCap, Award, Rocket, Globe, Sparkles, Building2, Flame)", timelineForm.icon, (v) => setTimelineForm((p) => ({ ...p, icon: v })))}
      </div>
      {a("Descrição do marco (1–2 linhas)", timelineForm.description, (v) => setTimelineForm((p) => ({ ...p, description: v })))}
      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="btn-brutalist-accent px-5 py-2 text-sm">{isPending ? "SALVANDO…" : "SALVAR"}</button>
        <button type="button" onClick={closeForm} className="btn-brutalist-outline px-5 py-2 text-sm">CANCELAR</button>
      </div>
    </form>
  );

  // ── Shared card wrapper ───────────────────────────────────────────────────────
  const formCard = (title: string, body: React.ReactNode) => (
    <div className="card-brutalist border-accent mb-3">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-extrabold text-base">{title}</h3>
        <button type="button" onClick={closeForm} className="text-muted-foreground hover:text-foreground transition"><X size={16} /></button>
      </div>
      {body}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b-4 border-foreground bg-background sticky top-0 z-40">
        <div className="container py-5 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">PAINEL ADMIN</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold hidden sm:block">{user.name}</span>
            <a href="/" className="btn-brutalist-outline text-sm px-4 py-2">SITE</a>
            <form action={logout}>
              <button type="submit" className="btn-brutalist-outline p-2" title="Sair">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-4 border-foreground">
        <div className="container flex gap-0 overflow-x-auto">
          {tabs.map(({ id, label }) => (
            <button key={id} onClick={() => { setActiveTab(id); closeForm(); }}
              className={`py-5 px-6 font-extrabold text-sm border-b-4 transition whitespace-nowrap ${activeTab === id ? "border-accent text-accent" : "border-transparent"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-8">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold">
            {activeTab === "projects" && "PROJETOS / AUTÔNOMO"}
            {activeTab === "certificates" && "CERTIFICADOS"}
            {activeTab === "skills" && "SKILLS"}
            {activeTab === "timeline" && "LINHA DO TEMPO"}
            {activeTab === "analytics" && "ANALYTICS"}
          </h2>
          {activeTab !== "analytics" && (
            <button onClick={openNew} className="btn-brutalist-accent flex items-center gap-2 px-5 py-2 text-sm">
              <Plus size={18} />ADICIONAR
            </button>
          )}
        </div>

        {/* ── NEW item form (top, only when editingId is null) ── */}
        {showNewForm && editingId === null && activeTab === "projects" && formCard("NOVO PROJETO", <ProjectFormBody isNew />)}
        {showNewForm && editingId === null && activeTab === "certificates" && formCard("NOVO CERTIFICADO", <CertFormBody isNew />)}
        {showNewForm && editingId === null && activeTab === "skills" && formCard("NOVA SKILL", <SkillFormBody isNew />)}
        {showNewForm && editingId === null && activeTab === "timeline" && formCard("NOVO MARCO NA LINHA DO TEMPO", <TimelineFormBody isNew />)}

        {/* ── LISTS ── */}
        <div className="space-y-3">

          {/* ANALYTICS — link pro painel da Vercel + instruções */}
          {activeTab === "analytics" && (
            <div className="space-y-4">
              <div className="card-brutalist border-accent">
                <h3 className="font-extrabold text-base mb-2">📊 Vercel Analytics</h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  O tracker já está instrumentado no <code className="px-1 bg-muted">app/layout.tsx</code>.
                  Os dados aparecem no painel da Vercel — visitantes únicos,
                  páginas mais acessadas, origem (referrer), país, dispositivo.
                </p>
                <a
                  href="https://vercel.com/vitordsb/vitor-portfolio/analytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brutalist-accent inline-flex items-center gap-2 px-5 py-2 text-sm"
                >
                  ABRIR DASHBOARD ↗
                </a>
              </div>

              <div className="card-brutalist">
                <h3 className="font-extrabold text-base mb-3">Como ativar (uma vez)</h3>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Faça deploy do projeto na Vercel (basta conectar o repo).</li>
                  <li>No dashboard da Vercel, vá em <strong>Project → Analytics</strong>.</li>
                  <li>Clique em <strong>Enable</strong>. Free tier cobre 2.500 eventos/mês.</li>
                  <li>Dados começam a aparecer ~1min após a primeira visita.</li>
                </ol>
              </div>

              <div className="card-brutalist">
                <h3 className="font-extrabold text-base mb-3">Métricas que valem acompanhar</h3>
                <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
                  <li>• <strong>Páginas mais visitadas</strong> — qual seção converte mais visitas</li>
                  <li>• <strong>Cliques em /autonomo → /contact</strong> — se o portfolio gera contato</li>
                  <li>• <strong>Referrers</strong> — LinkedIn, GitHub, busca direta</li>
                  <li>• <strong>Países</strong> — define se vale subir conteúdo EN</li>
                  <li>• <strong>Bounce no /</strong> — se o hero segura ou perde a atenção</li>
                </ul>
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {activeTab === "projects" && initialProjects.map((p) =>
            <Fragment key={p.id}>{editingId === p.id
              ? formCard("EDITAR PROJETO", <ProjectFormBody isNew={false} />)
              : (
                <div className="card-brutalist flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-extrabold text-base">{p.title}</h4>
                      {p.featured && (
                        <span className="text-[9px] font-mono font-bold bg-accent text-background px-2 py-0.5 tracking-widest">
                          DESTAQUE
                        </span>
                      )}
                      {p.slug && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          /{p.slug}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {p.company} · {p.category}
                      {p.period && <> · {p.period}</>}
                    </p>
                    {Array.isArray(p.tags) && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.map((t) => <span key={t} className="tag-badge">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setShowNewForm(false); setEditingId(p.id); setProjectForm({ title: p.title, company: p.company, description: p.description, category: p.category, slug: p.slug ?? "", period: p.period ?? "", featured: !!p.featured, coverImageUrl: p.coverImageUrl ?? "", liveLink: p.liveLink ?? "", repositoryLink: p.repositoryLink ?? "", tags: Array.isArray(p.tags) ? p.tags : [] }); }} className="btn-brutalist-outline p-2"><Edit2 size={16} /></button>
                    <button onClick={() => run(() => deleteProject(p.id))} disabled={isPending} className="btn-brutalist-outline p-2"><Trash2 size={16} /></button>
                  </div>
                </div>
              )
            }</Fragment>
          )}

          {/* CERTIFICATES */}

          {activeTab === "certificates" && initialCertificates.map((c) =>
            <Fragment key={c.id}>{editingId === c.id
              ? formCard("EDITAR CERTIFICADO", <CertFormBody isNew={false} />)
              : (
                <div className="card-brutalist flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-base mb-1">{c.name}</h4>
                    <p className="text-xs text-muted-foreground">{c.category}</p>
                    {Array.isArray(c.tags) && c.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">{c.tags.map((t) => <span key={t} className="tag-badge">{t}</span>)}</div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setShowNewForm(false); setEditingId(c.id); setCertForm({ name: c.name, description: c.description ?? "", category: c.category, link: c.link ?? "", tags: Array.isArray(c.tags) ? c.tags : [] }); }} className="btn-brutalist-outline p-2"><Edit2 size={16} /></button>
                    <button onClick={() => run(() => deleteCertificate(c.id))} disabled={isPending} className="btn-brutalist-outline p-2"><Trash2 size={16} /></button>
                  </div>
                </div>
              )
            }</Fragment>
          )}

          {/* SKILLS */}
          {activeTab === "skills" && initialSkills.map((s) =>
            <Fragment key={s.id}>{editingId === s.id
              ? formCard("EDITAR SKILL", <SkillFormBody isNew={false} />)
              : (
                <div className="card-brutalist flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {s.iconUrl && <img src={s.iconUrl} alt={s.title} className="w-10 h-10 object-contain" />}
                    <div><h4 className="font-extrabold text-base">{s.title}</h4>{s.category && <p className="text-xs text-muted-foreground">{s.category}</p>}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setShowNewForm(false); setEditingId(s.id); setSkillForm({ title: s.title, category: s.category ?? "", iconUrl: s.iconUrl ?? "", level: String(s.level ?? 3), projectSlugs: Array.isArray(s.projectSlugs) ? s.projectSlugs : [] }); }} className="btn-brutalist-outline p-2"><Edit2 size={16} /></button>
                    <button onClick={() => run(() => deleteSkill(s.id))} disabled={isPending} className="btn-brutalist-outline p-2"><Trash2 size={16} /></button>
                  </div>
                </div>
              )
            }</Fragment>
          )}

          {/* TIMELINE */}
          {activeTab === "timeline" && initialTimeline.map((tl) =>
            <Fragment key={tl.id}>{editingId === tl.id
              ? formCard("EDITAR MARCO", <TimelineFormBody isNew={false} />)
              : (
                <div className="card-brutalist flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-mono text-accent tracking-widest mb-1">
                      {tl.dateLabel}
                      {tl.category && <span className="text-muted-foreground/60 ml-2">· {tl.category}</span>}
                      {tl.icon && <span className="text-muted-foreground/60 ml-2">· ícone: {tl.icon}</span>}
                    </p>
                    <h4 className="font-extrabold text-base mb-1">{tl.title}</h4>
                    {tl.description && <p className="text-xs text-foreground/70 line-clamp-2">{tl.description}</p>}
                    <p className="text-[10px] font-mono text-muted-foreground/50 mt-1">
                      ordenação: {tl.sortDate}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setShowNewForm(false); setEditingId(tl.id); setTimelineForm({ dateLabel: tl.dateLabel, sortDate: tl.sortDate, title: tl.title, description: tl.description ?? "", category: tl.category ?? "", icon: tl.icon ?? "" }); }} className="btn-brutalist-outline p-2"><Edit2 size={16} /></button>
                    <button onClick={() => run(() => deleteTimelineEvent(tl.id))} disabled={isPending} className="btn-brutalist-outline p-2"><Trash2 size={16} /></button>
                  </div>
                </div>
              )
            }</Fragment>
          )}

        </div>
      </div>
    </div>
  );
}
