import { BlobNotFoundError, del, get, head, list, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import sharp from "sharp";
import type { PublicTestimonial, StoredTestimonial } from "./types";

/**
 * Depoimentos no Vercel Blob (sem banco, decisão de 21/out/2026):
 * - `depoimentos/dados/<id>.json`: o registro inteiro.
 * - `depoimentos/fotos/<id>-<aleatório>.webp`: a foto, já reprocessada.
 *
 * O id tem 72 bits aleatórios, então o endereço público do arquivo não se
 * adivinha. A home lê a lista com cache marcado (`depoimentos`) e cada envio
 * ou remoção chama `revalidateTag`: aparece e some sem deploy.
 *
 * Sem o Blob ligado (dev local sem token), a lista vem vazia e a seção some.
 */

export const TESTIMONIALS_TAG = "depoimentos";
const DATA = "depoimentos/dados/";
const PHOTOS = "depoimentos/fotos/";

export function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

function dataPath(id: string) {
  return `${DATA}${id}.json`;
}

/** O link único já foi usado? */
export async function testimonialExists(id: string): Promise<boolean> {
  try {
    await head(dataPath(id));
    return true;
  } catch (e) {
    if (e instanceof BlobNotFoundError) return false;
    throw e;
  }
}

/**
 * Reprocessa a foto: recorte quadrado 480x480 em webp. O sharp descarta os
 * metadados por padrão, então GPS e dados da câmera não vão junto. Arquivo
 * que não é imagem de verdade (PDF renomeado etc.) lança aqui.
 */
export async function savePhoto(id: string, file: Buffer): Promise<string> {
  const webp = await sharp(file, { limitInputPixels: 40_000_000 })
    .rotate()
    .resize(480, 480, { fit: "cover", position: "attention" })
    .webp({ quality: 82 })
    .toBuffer();
  const res = await put(`${PHOTOS}${id}.webp`, webp, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: true,
  });
  return res.url;
}

export async function deletePhoto(url: string): Promise<void> {
  await del(url).catch((e) => console.error("[depoimentos] foto não apagada:", e));
}

/** Grava o depoimento. Lança se o id já existe (link usado duas vezes). */
export async function createTestimonial(t: StoredTestimonial): Promise<void> {
  await put(dataPath(t.id), JSON.stringify(t), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: false,
    cacheControlMaxAge: 60,
  });
}

export async function readTestimonial(id: string): Promise<StoredTestimonial | null> {
  const res = await get(dataPath(id), { access: "public", useCache: false }).catch(() => null);
  if (!res || res.statusCode !== 200) return null;
  try {
    return JSON.parse(await new Response(res.stream).text()) as StoredTestimonial;
  } catch {
    return null;
  }
}

/** Tira do site: marca como removido e apaga a foto. */
export async function removeTestimonial(id: string): Promise<StoredTestimonial | null> {
  const t = await readTestimonial(id);
  if (!t) return null;
  if (t.status === "removido") return t;
  if (t.photoUrl) await deletePhoto(t.photoUrl);
  const next: StoredTestimonial = { ...t, status: "removido", photoUrl: null, removedAt: new Date().toISOString() };
  await put(dataPath(id), JSON.stringify(next), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
  return next;
}

async function loadPublished(): Promise<PublicTestimonial[]> {
  if (!blobConfigured()) return [];
  try {
    const { blobs } = await list({ prefix: DATA, limit: 1000 });
    const all = await Promise.all(blobs.map((b) => readTestimonial(b.pathname.slice(DATA.length, -5))));
    return all
      .filter((t): t is StoredTestimonial => t?.status === "publicado")
      // Cliente verificado primeiro; dentro de cada grupo, o mais novo
      .sort((a, b) => Number(b.verified) - Number(a.verified) || b.createdAt.localeCompare(a.createdAt))
      .map(({ id, project, name, role, projectName, photoUrl, quote, rating, verified }) => ({
        id,
        project,
        name,
        role,
        projectName,
        photoUrl,
        quote,
        rating,
        verified,
      }));
  } catch (e) {
    console.error("[depoimentos] falha ao listar:", e);
    return [];
  }
}

/** Depoimentos no ar, com cache até o próximo envio ou remoção (ou 1 hora). */
export const getPublishedTestimonials = unstable_cache(loadPublished, ["depoimentos-publicados-v2"], {
  tags: [TESTIMONIALS_TAG],
  revalidate: 3600,
});
