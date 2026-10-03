/**
 * Prepara uma imagem do cliente (upload, colada ou arrastada) antes de ir pro
 * servidor: reduz pro lado maior de 1600px e regrava em JPEG. Uma foto de
 * celular de 4 MB vira ~300 KB, e o pedido cabe no limite de 4,5 MB da Vercel.
 * O servidor valida e regrava de novo (lib/estimate/images.ts): isto aqui é
 * conforto, não segurança.
 */

const MAX_SIDE = 1600;
/** Original acima disso nem tenta (foto RAW, vídeo renomeado...). */
const MAX_INPUT_BYTES = 15 * 1024 * 1024;
/** Teto depois de reduzir: o servidor aceita até 1,5 MB por imagem. */
const MAX_OUTPUT_BYTES = 1.3 * 1024 * 1024;

export class PrepareError extends Error {
  constructor(readonly reason: "tipo" | "grande" | "ilegivel") {
    super(reason);
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new PrepareError("ilegivel"));
    };
    img.src = url;
  });
}

/** Tamanho aproximado em bytes de um data URL base64. */
function dataUrlBytes(url: string) {
  return Math.ceil(((url.length - url.indexOf(",") - 1) * 3) / 4);
}

export async function prepareImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new PrepareError("tipo");
  if (file.size > MAX_INPUT_BYTES) throw new PrepareError("grande");

  // O navegador aplica a orientação da foto (EXIF) ao desenhar no canvas
  const img = await loadImage(file);
  const scale = Math.min(
    1,
    MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight),
  );
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new PrepareError("ilegivel");
  // Fundo branco: PNG com transparência não vira preto no JPEG
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  for (const quality of [0.82, 0.7, 0.55]) {
    const url = canvas.toDataURL("image/jpeg", quality);
    if (dataUrlBytes(url) <= MAX_OUTPUT_BYTES) return url;
  }
  throw new PrepareError("grande");
}
