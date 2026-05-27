"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import { verifyPassword } from "./crypto";
import { createSessionToken } from "./oauth";
import * as db from "./db";

async function getRequestIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip")?.trim() ?? "unknown";
}

function ipAllowed(ip: string): boolean {
  const allowed = (process.env.ADMIN_ALLOWED_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const localhost = ip === "127.0.0.1" || ip === "::1" || ip === "unknown";
  if (allowed.length === 0) return localhost;
  if (localhost && process.env.NODE_ENV !== "production") return true;
  return allowed.includes(ip);
}

async function assertAdmin() {
  const ip = await getRequestIp();
  if (!ipAllowed(ip)) throw new Error("Forbidden");
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");
  return user;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("app_session_id");
  redirect("/");
}

export async function loginWithPassword(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const username = (formData.get("username") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!username || !password) return { error: "Preencha todos os campos." };

  const user = await db.getUserByUsername(username);
  if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return { error: "Usuário ou senha inválidos." };
  }

  const token = await createSessionToken(user.openId, user.name ?? username);
  const cookieStore = await cookies();
  cookieStore.set("app_session_id", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  redirect("/admin");
}

// ── Projects ─────────────────────────────────────────────────────────────────
type ProjectInput = {
  title: string; company: string; description: string; category: string;
  slug?: string; period?: string; featured?: boolean;
  coverImageUrl?: string; liveLink?: string; repositoryLink?: string; tags?: string[];
};

export async function createProject(data: ProjectInput) {
  await assertAdmin();
  await db.createProject(data);
  revalidatePath("/"); revalidatePath("/admin");
}

export async function updateProject(id: number, data: ProjectInput) {
  await assertAdmin();
  await db.updateProject(id, data);
  revalidatePath("/"); revalidatePath("/admin");
}

export async function deleteProject(id: number) {
  await assertAdmin();
  await db.deleteProject(id);
  revalidatePath("/"); revalidatePath("/admin");
}

// ── Certificates ──────────────────────────────────────────────────────────────
type CertInput = {
  name: string; category: string; description?: string; link?: string; tags?: string[];
};

export async function createCertificate(data: CertInput) {
  await assertAdmin();
  await db.createCertificate(data);
  revalidatePath("/"); revalidatePath("/admin");
}

export async function updateCertificate(id: number, data: CertInput) {
  await assertAdmin();
  await db.updateCertificate(id, data);
  revalidatePath("/"); revalidatePath("/admin");
}

export async function deleteCertificate(id: number) {
  await assertAdmin();
  await db.deleteCertificate(id);
  revalidatePath("/"); revalidatePath("/admin");
}

// ── Skills ───────────────────────────────────────────────────────────────────
type SkillInput = {
  title: string; category?: string; iconUrl?: string;
  level?: number; projectSlugs?: string[];
};

export async function createSkill(data: SkillInput) {
  await assertAdmin();
  await db.createSkill(data);
  revalidatePath("/"); revalidatePath("/admin");
}

export async function updateSkill(id: number, data: SkillInput) {
  await assertAdmin();
  await db.updateSkill(id, data);
  revalidatePath("/"); revalidatePath("/admin");
}

export async function deleteSkill(id: number) {
  await assertAdmin();
  await db.deleteSkill(id);
  revalidatePath("/"); revalidatePath("/admin");
}

// ── Freelance Work ────────────────────────────────────────────────────────────
type FreelanceInput = {
  company: string; description: string; role?: string;
  period?: string; website?: string; companyLogoUrl?: string;
  tags?: string[]; displayOrder?: number;
};

export async function createFreelanceWork(data: FreelanceInput) {
  await assertAdmin();
  await db.createFreelanceWork({ ...data, displayOrder: data.displayOrder ?? 0 });
  revalidatePath("/"); revalidatePath("/admin");
}

export async function updateFreelanceWork(id: number, data: FreelanceInput) {
  await assertAdmin();
  await db.updateFreelanceWork(id, data);
  revalidatePath("/"); revalidatePath("/admin");
}

export async function deleteFreelanceWork(id: number) {
  await assertAdmin();
  await db.deleteFreelanceWork(id);
  revalidatePath("/"); revalidatePath("/admin");
}

// ── Timeline Events ───────────────────────────────────────────────────────────
type TimelineInput = {
  dateLabel: string; sortDate: string; title: string;
  description?: string; category?: string; icon?: string;
};

export async function createTimelineEvent(data: TimelineInput) {
  await assertAdmin();
  await db.createTimelineEvent(data);
  revalidatePath("/about"); revalidatePath("/admin");
}

export async function updateTimelineEvent(id: number, data: TimelineInput) {
  await assertAdmin();
  await db.updateTimelineEvent(id, data);
  revalidatePath("/about"); revalidatePath("/admin");
}

export async function deleteTimelineEvent(id: number) {
  await assertAdmin();
  await db.deleteTimelineEvent(id);
  revalidatePath("/about"); revalidatePath("/admin");
}

// ── Contact (público) ─────────────────────────────────────────────────────────
type ContactInput = {
  name: string;
  email?: string;
  company?: string;
  subject?: string;
  message: string;
};

export async function sendContactMessage(
  data: ContactInput,
): Promise<{ ok: boolean; error?: string }> {
  // Validação básica
  const name = data.name?.trim();
  const message = data.message?.trim();
  if (!name || name.length < 2) return { ok: false, error: "Nome inválido." };
  if (!message || message.length < 5) return { ok: false, error: "Mensagem muito curta." };
  if (message.length > 5000) return { ok: false, error: "Mensagem muito longa." };

  const payload = {
    name,
    email: data.email?.trim() || null,
    company: data.company?.trim() || null,
    subject: data.subject?.trim() || null,
    message,
  };

  // 1) Sempre registra no banco (garante recebimento mesmo sem email configurado)
  try {
    await db.createContactMessage(payload);
  } catch (e) {
    console.error("[contact] falha ao salvar no banco:", e);
    // não aborta — ainda tenta enviar email
  }

  // 2) Envia email via Resend, se configurado
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "vitordsb2019@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        replyTo: payload.email ?? undefined,
        subject: `[Portfolio] ${payload.subject || "Novo contato"} — ${name}`,
        text: [
          `Nome: ${name}`,
          `Email: ${payload.email ?? "—"}`,
          `Empresa: ${payload.company ?? "—"}`,
          `Assunto: ${payload.subject ?? "—"}`,
          "",
          payload.message,
        ].join("\n"),
      });
    } catch (e) {
      console.error("[contact] falha ao enviar email (Resend):", e);
      // banco já tem o registro — segue ok pro usuário
    }
  }

  revalidatePath("/admin");
  return { ok: true };
}

// ── Contact admin (gerenciar mensagens) ─────────────────────────────────────────
export async function markContactRead(id: number, read: boolean) {
  await assertAdmin();
  await db.markContactMessageRead(id, read);
  revalidatePath("/admin");
}

export async function deleteContactMessage(id: number) {
  await assertAdmin();
  await db.deleteContactMessage(id);
  revalidatePath("/admin");
}
