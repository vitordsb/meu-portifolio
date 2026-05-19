/**
 * Seed script — creates the admin user with username/password credentials.
 * Run with: pnpm db:seed
 *
 * Usage:
 *   ADMIN_USERNAME=root ADMIN_PASSWORD=senha123 pnpm db:seed
 *
 * Or with defaults (root / senha123):
 *   pnpm db:seed
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { scryptSync, randomBytes } from "crypto";
import { users } from "../drizzle/schema";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");

  const db = drizzle(url);

  const username = process.env.ADMIN_USERNAME ?? "root";
  const password = process.env.ADMIN_PASSWORD ?? "senha123";
  const openId = `local:${username}`;

  // Check if user already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existing.length > 0) {
    console.log(`✓ Usuário "${username}" já existe — nada foi alterado.`);
    process.exit(0);
  }

  const passwordHash = hashPassword(password);

  await db.insert(users).values({
    openId,
    name: username,
    username,
    passwordHash,
    role: "admin",
    lastSignedIn: new Date(),
  });

  console.log(`✓ Usuário admin criado: ${username}`);
  console.log(`  Senha: ${password}`);
  console.log(`  Troque a senha em produção!`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Erro ao executar seed:", err);
  process.exit(1);
});
