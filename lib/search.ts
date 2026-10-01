/**
 * Motor da busca (ctrl + espaço). Não é IA de verdade: é um ranking local que
 * tenta parecer esperto sem custo nem API.
 *
 *   - ignora acento e caixa ("Trajetória" = "trajetoria")
 *   - joga fora palavra de enchimento ("quero ver seus projetos" = "projetos")
 *   - aceita prefixo ("proj") e um erro de digitação ("projtos")
 *   - cada item carrega sinônimos, então "trabalhos" acha Projetos
 *
 * Devolve 0 a 1, no formato que o `filter` do cmdk espera.
 */

const STOPWORDS = new Set([
  // pt
  "a",
  "o",
  "as",
  "os",
  "um",
  "uma",
  "de",
  "do",
  "da",
  "dos",
  "das",
  "e",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "pra",
  "para",
  "por",
  "com",
  "que",
  "me",
  "eu",
  "voce",
  "vc",
  "seu",
  "sua",
  "seus",
  "suas",
  "meu",
  "minha",
  "meus",
  "minhas",
  "quero",
  "queria",
  "ver",
  "mostra",
  "mostrar",
  "mostre",
  "tem",
  "ter",
  "algum",
  "alguma",
  "sobre",
  "qual",
  "quais",
  "como",
  "onde",
  "isso",
  "esse",
  "essa",
  // en
  "the",
  "an",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "i",
  "me",
  "my",
  "your",
  "you",
  "show",
  "see",
  "want",
  "what",
  "which",
  "how",
  "where",
  "about",
  "is",
]);

export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/** Quebra em palavras mantendo coisas como "next.js", "c#" e "c++". */
export function words(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9+#.]+/)
    .map((w) => w.replace(/^\.+|\.+$/g, ""))
    .filter(Boolean);
}

/** Distância de edição até 1 (troca, inclusão ou remoção de uma letra). */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function tokenScore(token: string, hay: string[]): number {
  let best = 0;
  for (const w of hay) {
    if (w === token) return 1;
    if (w.startsWith(token))
      best = Math.max(best, token.length >= 2 ? 0.85 : 0.5);
    else if (token.length >= 3 && w.includes(token)) best = Math.max(best, 0.6);
    else if (token.length >= 4) {
      // Erro de digitação na palavra inteira ou no começo dela
      if (withinOneEdit(token, w)) best = Math.max(best, 0.55);
      else if (withinOneEdit(token, w.slice(0, token.length)))
        best = Math.max(best, 0.45);
    }
  }
  return best;
}

/**
 * Quanto `search` combina com um item. `keywords[0]` é o rótulo visível e ganha
 * um bônus quando a busca bate com o começo dele.
 */
export function scoreItem(search: string, keywords: string[]): number {
  const all = words(search);
  if (all.length === 0) return 1;
  // Se a pessoa só digitou enchimento ("o que"), usa o que tem mesmo
  const meaningful = all.filter((w) => !STOPWORDS.has(w));
  const tokens = meaningful.length > 0 ? meaningful : all;

  const hay = keywords.flatMap(words);
  let total = 0;
  for (const t of tokens) {
    const s = tokenScore(t, hay);
    if (s === 0) return 0;
    total += s;
  }
  let score = total / tokens.length;

  const label = normalize(keywords[0] ?? "");
  if (label.startsWith(tokens.join(" "))) score += 0.15;
  return Math.min(1, score);
}
