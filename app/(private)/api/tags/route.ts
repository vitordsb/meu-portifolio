import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { projects, certificates, freelanceWork } from "@/drizzle/schema";

export async function GET() {
  const db = await getDb();
  if (!db) return NextResponse.json([]);

  const [allProjects, allCerts, allFreelance] = await Promise.all([
    db.select({ tags: projects.tags }).from(projects),
    db.select({ tags: certificates.tags }).from(certificates),
    db.select({ tags: freelanceWork.tags }).from(freelanceWork),
  ]);

  const tagSet = new Set<string>();
  for (const item of [...allProjects, ...allCerts, ...allFreelance]) {
    if (Array.isArray(item.tags)) {
      for (const tag of item.tags) tagSet.add(tag);
    }
  }

  return NextResponse.json(Array.from(tagSet).sort((a, b) => a.localeCompare(b)));
}
