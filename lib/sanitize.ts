/**
 * Limpeza de texto vindo do visitante (SPEC de segurança, S9).
 *
 * Remove o que não aparece na tela mas engana quem lê: caracteres de controle,
 * de largura zero e de inversão de direção (o U+202E faz "gpj.exe" virar
 * "exe.jpg" visualmente). Mantém quebra de linha e tab. Normaliza em NFC pra
 * a mesma palavra não ter duas grafias por baixo.
 */

// Controle (menos \t \n \r), DEL, C1, largura zero, separadores de linha
// Unicode, marcas e isolamentos de direção, BOM e anotações interlineares.
const INVISIBLE = new RegExp(
  "[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F-\\u009F" +
    "\\u200B-\\u200F\\u2028\\u2029\\u202A-\\u202E\\u2060-\\u2064" +
    "\\u2066-\\u2069\\uFEFF\\uFFF9-\\uFFFB]",
  "g",
);

export function cleanText(value: string): string {
  return value.normalize("NFC").replace(INVISIBLE, "");
}

/** Pra campos de uma linha (nome, e-mail, assunto): sem quebra de linha. */
export function cleanLine(value: string): string {
  return cleanText(value)
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
