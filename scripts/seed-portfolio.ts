/**
 * Seed portfolio — migra todo o conteúdo de lib/portfolio-data.ts pro banco.
 *
 * Idempotente:
 *   - Skill (chave: title)
 *   - Project (chave: slug)
 *   - Certificate (chave: name)
 *   - TimelineEvent (chave: sortDate)
 * Se a chave já existe no banco, atualiza os campos. Senão, insere.
 *
 * Uso: pnpm db:seed:portfolio
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import { eq } from "drizzle-orm";
import {
  projects,
  skills,
  certificates,
  timelineEvents,
} from "../drizzle/schema";
import {
  allWork,
  hardcodedSkills,
  hardcodedCertificates,
  hardcodedTimeline,
} from "../lib/portfolio-data";

function needsSsl(url: string): boolean {
  return /tidbcloud|aivencloud|planetscale|psdb\.cloud|neon\.tech|ssl=true|ssl-mode=/i.test(url);
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  const db = needsSsl(url)
    ? drizzle(mysql.createPool({ uri: url, ssl: { rejectUnauthorized: true } }))
    : drizzle(url);

  let inserted = 0;
  let updated = 0;

  // ── Projects (a partir de allWork) ────────────────────────────────────────
  for (const w of allWork) {
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, w.slug))
      .limit(1);

    const data = {
      slug: w.slug,
      title: w.title,
      company: w.company,
      description: w.description,
      category: w.category,
      period: w.period ?? null,
      featured: w.featured,
      coverImageUrl: w.coverImageUrl,
      liveLink: w.liveLink,
      repositoryLink: null,
      tags: w.stack,
    };

    if (existing[0]) {
      await db.update(projects).set(data).where(eq(projects.id, existing[0].id));
      updated++;
    } else {
      await db.insert(projects).values(data);
      inserted++;
    }
  }

  // ── Skills ────────────────────────────────────────────────────────────────
  for (const s of hardcodedSkills) {
    const existing = await db
      .select()
      .from(skills)
      .where(eq(skills.title, s.title))
      .limit(1);

    const data = {
      title: s.title,
      iconUrl: s.iconUrl,
      iconKey: null,
      category: s.category,
      level: s.level,
      projectSlugs: s.projectSlugs,
    };

    if (existing[0]) {
      await db.update(skills).set(data).where(eq(skills.id, existing[0].id));
      updated++;
    } else {
      await db.insert(skills).values(data);
      inserted++;
    }
  }

  // ── Certificates ──────────────────────────────────────────────────────────
  for (const c of hardcodedCertificates) {
    const existing = await db
      .select()
      .from(certificates)
      .where(eq(certificates.name, c.name))
      .limit(1);

    const data = {
      name: c.name,
      description: c.description,
      category: c.category,
      link: null,
      fileUrl: null,
      tags: c.tags,
    };

    if (existing[0]) {
      await db
        .update(certificates)
        .set(data)
        .where(eq(certificates.id, existing[0].id));
      updated++;
    } else {
      await db.insert(certificates).values(data);
      inserted++;
    }
  }

  // ── Timeline ──────────────────────────────────────────────────────────────
  for (const e of hardcodedTimeline) {
    const existing = await db
      .select()
      .from(timelineEvents)
      .where(eq(timelineEvents.sortDate, e.sortDate))
      .limit(1);

    const data = {
      dateLabel: e.dateLabel,
      sortDate: e.sortDate,
      title: e.title,
      description: e.description,
      category: e.category,
      icon: e.icon,
    };

    if (existing[0]) {
      await db
        .update(timelineEvents)
        .set(data)
        .where(eq(timelineEvents.id, existing[0].id));
      updated++;
    } else {
      await db.insert(timelineEvents).values(data);
      inserted++;
    }
  }

  console.log(`✓ Seed portfolio concluído.`);
  console.log(`  Inseridos: ${inserted}`);
  console.log(`  Atualizados: ${updated}`);
  console.log(`  Total: ${inserted + updated}`);
  console.log(``);
  console.log(`Agora todo o conteúdo é editável em /admin.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
