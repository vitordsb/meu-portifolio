import { boolean, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  username: varchar("username", { length: 64 }).unique(),
  passwordHash: text("passwordHash"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects table for portfolio showcase
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  /** Slug interno único (ex: "arqdoor"). Útil pra referências cruzadas (skill.projects[]). */
  slug: varchar("slug", { length: 100 }).unique(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  /** Período do trabalho (ex: "Abr/2025 — Hoje"). */
  period: varchar("period", { length: 100 }),
  /** Aparece como destaque na home (top 3). */
  featured: boolean("featured").default(false).notNull(),
  coverImageUrl: text("coverImageUrl"),
  coverImageKey: varchar("coverImageKey", { length: 255 }),
  liveLink: varchar("liveLink", { length: 500 }),
  repositoryLink: varchar("repositoryLink", { length: 500 }),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Certificates table for credentials showcase
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  link: varchar("link", { length: 500 }),
  fileUrl: text("fileUrl"),
  fileKey: varchar("fileKey", { length: 255 }),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Skills table for technology showcase
 */
export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  iconUrl: text("iconUrl"),
  iconKey: varchar("iconKey", { length: 255 }),
  category: varchar("category", { length: 100 }),
  /** Nível 1-5 (1=básico, 5=especialista). Exibido no hover-card. */
  level: int("level").default(3).notNull(),
  /** Slugs dos projetos onde a skill é usada (referência a projects.slug). */
  projectSlugs: json("projectSlugs").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

/**
 * Freelance work table — private client projects
 */
export const freelanceWork = mysqlTable("freelance_work", {
  id: int("id").autoincrement().primaryKey(),
  company: varchar("company", { length: 255 }).notNull(),
  companyLogoUrl: text("companyLogoUrl"),
  role: varchar("role", { length: 255 }),
  description: text("description").notNull(),
  period: varchar("period", { length: 100 }),
  website: varchar("website", { length: 500 }),
  tags: json("tags").$type<string[]>(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FreelanceWork = typeof freelanceWork.$inferSelect;
export type InsertFreelanceWork = typeof freelanceWork.$inferInsert;

/**
 * Timeline events — marcos da história profissional
 * (career start, faculdade, cursos, primeiros clientes, etc).
 * Renderizado como linha do tempo horizontal no /about.
 */
export const timelineEvents = mysqlTable("timeline_events", {
  id: int("id").autoincrement().primaryKey(),
  /** Data/marco no formato livre (ex: "Ago/2023", "2024", "Jan/2026") */
  dateLabel: varchar("dateLabel", { length: 50 }).notNull(),
  /** Data canônica usada para ordenação (YYYY-MM-DD). */
  sortDate: varchar("sortDate", { length: 10 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  /** Categoria livre (ex: "Carreira", "Educação", "Cliente"). */
  category: varchar("category", { length: 80 }),
  /** Nome do ícone Lucide (ex: "Briefcase", "GraduationCap", "Rocket"). */
  icon: varchar("icon", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = typeof timelineEvents.$inferInsert;