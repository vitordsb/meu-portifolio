import { eq, asc, desc, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import {
  users, projects, certificates, skills, freelanceWork, timelineEvents, contactMessages,
  type InsertUser, type InsertProject, type InsertCertificate,
  type InsertSkill, type InsertFreelanceWork, type InsertTimelineEvent,
  type InsertContactMessage,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Cria pool MySQL aplicando SSL automaticamente quando necessário.
 * Providers cloud (TiDB, PlanetScale, Aiven) exigem TLS — detectamos pelo host
 * ou pelo query param `?ssl=true`.
 */
function shouldUseSsl(url: string): boolean {
  if (/ssl=(true|require|verify|VERIFY)/i.test(url)) return true;
  if (/ssl-mode=(REQUIRED|VERIFY_IDENTITY|VERIFY_CA)/i.test(url)) return true;
  // Hosts conhecidos que exigem TLS
  return /tidbcloud\.com|aivencloud\.com|psdb\.cloud|planetscale\.com|aws\.neon\.tech/i.test(url);
}

export async function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.error("[DB] DATABASE_URL não está definido nas env vars");
      return null;
    }
    try {
      if (shouldUseSsl(url)) {
        // Pool com SSL pra providers cloud
        // Parse URL pra log seguro (sem expor senha)
        const u = new URL(url);
        console.log(`[DB] Conectando com TLS em ${u.hostname}:${u.port}/${u.pathname.slice(1)}`);
        const pool = mysql.createPool({
          uri: url,
          ssl: { rejectUnauthorized: true },
          connectTimeout: 10000,
        });
        _db = drizzle(pool);
      } else {
        console.log("[DB] Conectando sem TLS");
        _db = drizzle(url);
      }
    } catch (e) {
      console.error("[DB] Falha ao criar pool:", e);
    }
  }
  return _db;
}

// ── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("openId required");
  const db = await getDb();
  if (!db) return console.warn("[DB] upsertUser skipped — no db");

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field]; updateSet[field] = user[field]; }
  }
  if (user.lastSignedIn) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === process.env.OWNER_OPEN_ID) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const res = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return res[0];
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  const res = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return res[0];
}

// ── Projects ─────────────────────────────────────────────────────────────────
export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(projects.createdAt);
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(projects).values(data);
}

export async function updateProject(id: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(projects).set(data).where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.delete(projects).where(eq(projects.id, id));
}

// ── Competencies (derived from project + certificate tags) ───────────────────
export async function getCompetencies() {
  const db = await getDb();
  if (!db) return [];
  const [allProjects, allCerts, allFreelance] = await Promise.all([
    db.select({ tags: projects.tags }).from(projects),
    db.select({ tags: certificates.tags }).from(certificates),
    db.select({ tags: freelanceWork.tags }).from(freelanceWork),
  ]);
  const freq: Record<string, number> = {};
  for (const p of [...allProjects, ...allCerts, ...allFreelance]) {
    if (Array.isArray(p.tags)) {
      for (const tag of p.tags) freq[tag] = (freq[tag] ?? 0) + 1;
    }
  }
  const max = Math.max(1, ...Object.values(freq));
  return Object.entries(freq)
    .map(([tag, count]) => ({ tag, count, percentage: Math.round((count / max) * 100) }))
    .sort((a, b) => b.count - a.count);
}

// ── Certificates ──────────────────────────────────────────────────────────────
export async function getAllCertificates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(certificates).orderBy(certificates.createdAt);
}

export async function getCertificateCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const res = await db.select({ value: count() }).from(certificates);
  return res[0]?.value ?? 0;
}

export async function getProjectCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const res = await db.select({ value: count() }).from(projects);
  return res[0]?.value ?? 0;
}

export async function createCertificate(data: InsertCertificate) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(certificates).values(data);
}

export async function updateCertificate(id: number, data: Partial<InsertCertificate>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(certificates).set(data).where(eq(certificates.id, id));
}

export async function deleteCertificate(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.delete(certificates).where(eq(certificates.id, id));
}

// ── Skills ───────────────────────────────────────────────────────────────────
export async function getAllSkills() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(skills).orderBy(skills.createdAt);
}

export async function createSkill(data: InsertSkill) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(skills).values(data);
}

export async function updateSkill(id: number, data: Partial<InsertSkill>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(skills).set(data).where(eq(skills.id, id));
}

export async function deleteSkill(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.delete(skills).where(eq(skills.id, id));
}

// ── Freelance Work ────────────────────────────────────────────────────────────
export async function getAllFreelanceWork() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(freelanceWork).orderBy(freelanceWork.displayOrder, freelanceWork.createdAt);
}

export async function createFreelanceWork(data: InsertFreelanceWork) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(freelanceWork).values(data);
}

export async function updateFreelanceWork(id: number, data: Partial<InsertFreelanceWork>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(freelanceWork).set(data).where(eq(freelanceWork.id, id));
}

export async function deleteFreelanceWork(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.delete(freelanceWork).where(eq(freelanceWork.id, id));
}

// ── Timeline Events ───────────────────────────────────────────────────────────
export async function getAllTimelineEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(timelineEvents).orderBy(asc(timelineEvents.sortDate));
}

export async function createTimelineEvent(data: InsertTimelineEvent) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(timelineEvents).values(data);
}

export async function updateTimelineEvent(id: number, data: Partial<InsertTimelineEvent>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(timelineEvents).set(data).where(eq(timelineEvents.id, id));
}

export async function deleteTimelineEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.delete(timelineEvents).where(eq(timelineEvents.id, id));
}

// ── Contact Messages ──────────────────────────────────────────────────────────
export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(contactMessages).values(data);
}

export async function getAllContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function markContactMessageRead(id: number, read: boolean) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id));
}

export async function deleteContactMessage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.delete(contactMessages).where(eq(contactMessages.id, id));
}

// ── GitHub Repos ──────────────────────────────────────────────────────────────
export type GithubRepo = {
  id: number; name: string; description: string; htmlUrl: string;
  language: string; stars: number; topics: string[]; updatedAt: string;
};

export async function getGithubRepos(): Promise<GithubRepo[]> {
  const username = process.env.GITHUB_USERNAME;
  if (!username) return [];
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, unknown>[];
    return data
      .filter((r) => !r.fork)
      .map((r) => ({
        id: r.id as number, name: r.name as string,
        description: (r.description ?? "") as string,
        htmlUrl: r.html_url as string, language: (r.language ?? "") as string,
        stars: r.stargazers_count as number,
        topics: (r.topics ?? []) as string[],
        updatedAt: r.updated_at as string,
      }));
  } catch {
    return [];
  }
}
