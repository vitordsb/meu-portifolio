import sharp from "sharp";

/**
 * Imagens anexadas no orçamento com IA. Não ficam guardadas em lugar nenhum:
 * vão como anexo no e-mail do pedido pro Vitor. A IA não vê o conteúdo.
 *
 * Toda imagem é decodificada e regravada aqui (sharp): arquivo disfarçado de
 * imagem não passa, e os metadados somem junto, inclusive a localização GPS
 * de foto de celular. O navegador já reduz antes de enviar; os limites
 * abaixo são a segunda barreira.
 */

export const MAX_IMAGES = 4;
/** Por imagem, já em base64 decodificado (o navegador manda ~300 KB). */
const MAX_BYTES = 1.5 * 1024 * 1024;
/** Soma do pedido: abaixo do limite de 4,5 MB do corpo na Vercel. */
const MAX_TOTAL_BYTES = 3.5 * 1024 * 1024;
const MAX_SIDE = 1600;

export type CleanImage = { filename: string; content: Buffer };

const DATA_URL = /^data:image\/(png|jpe?g|webp|gif);base64,([A-Za-z0-9+/=]+)$/;

export class ImageError extends Error {}

export async function cleanImages(
  input: unknown,
  prefix: string,
): Promise<CleanImage[]> {
  if (input === undefined || input === null) return [];
  if (!Array.isArray(input)) throw new ImageError("formato");
  if (input.length > MAX_IMAGES) throw new ImageError("quantidade");

  let total = 0;
  const out: CleanImage[] = [];
  for (const [i, item] of input.entries()) {
    const m = typeof item === "string" ? DATA_URL.exec(item) : null;
    if (!m) throw new ImageError("formato");
    const raw = Buffer.from(m[2], "base64");
    if (raw.length === 0 || raw.length > MAX_BYTES)
      throw new ImageError("tamanho");
    total += raw.length;
    if (total > MAX_TOTAL_BYTES) throw new ImageError("tamanho");

    let content: Buffer;
    try {
      content = await sharp(raw, {
        limitInputPixels: 40_000_000,
        animated: false,
      })
        .rotate() // aplica a orientação do celular antes de perder o EXIF
        .resize(MAX_SIDE, MAX_SIDE, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true }) // sem withMetadata: EXIF/GPS saem
        .toBuffer();
    } catch {
      throw new ImageError("invalida");
    }
    out.push({ filename: `${prefix}-${i + 1}.jpg`, content });
  }
  return out;
}
