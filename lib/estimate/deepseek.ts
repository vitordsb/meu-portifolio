/**
 * Cliente mínimo da DeepSeek (API no formato OpenAI). Sem SDK: são duas
 * chamadas, e fetch puro deixa o stream e os limites na nossa mão.
 *
 * Env:
 *   DEEPSEEK_API_KEY   obrigatório em produção
 *   DEEPSEEK_MODEL     padrão "deepseek-chat"
 *   DEEPSEEK_BASE_URL  padrão "https://api.deepseek.com"
 */

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const BASE_URL = (
  process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com"
).replace(/\/$/, "");
const MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";
const TIMEOUT_MS = 45_000;

export class AiUnavailableError extends Error {}

export function hasAiKey() {
  return Boolean(process.env.DEEPSEEK_API_KEY);
}

function withTimeout(signal?: AbortSignal) {
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

async function post(body: Record<string, unknown>, signal?: AbortSignal) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new AiUnavailableError("DEEPSEEK_API_KEY ausente");

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model: MODEL, ...body }),
    signal: withTimeout(signal),
  });

  if (!res.ok) {
    // 402 = saldo acabou; 429 = limite da conta. Ambos viram "indisponível"
    // pro cliente, mas o log diz qual foi.
    const detail = await res.text().catch(() => "");
    console.error(
      `[orcamento] DeepSeek ${res.status}: ${detail.slice(0, 300)}`,
    );
    throw new AiUnavailableError(`DeepSeek ${res.status}`);
  }
  return res;
}

/** Resposta em stream: devolve os pedaços de texto conforme chegam. */
export async function* streamChat(
  messages: ChatMessage[],
  opts: { maxTokens: number; signal?: AbortSignal },
): AsyncGenerator<string> {
  const res = await post(
    {
      messages,
      stream: true,
      max_tokens: opts.maxTokens,
      temperature: 0.7,
    },
    opts.signal,
  );
  if (!res.body) throw new AiUnavailableError("stream vazio");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      // Linhas vazias e ": keep-alive" (a DeepSeek manda enquanto pensa)
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const piece: unknown = json?.choices?.[0]?.delta?.content;
        if (typeof piece === "string" && piece) yield piece;
      } catch {
        // pedaço malformado: ignora, o resto do stream segue
      }
    }
  }
}

/** Uma chamada em modo JSON. Devolve o objeto já parseado (sem validar). */
export async function completeJson(
  messages: ChatMessage[],
  opts: { maxTokens: number; signal?: AbortSignal },
): Promise<unknown> {
  const res = await post(
    {
      messages,
      max_tokens: opts.maxTokens,
      temperature: 0.1,
      response_format: { type: "json_object" },
    },
    opts.signal,
  );
  const json = await res.json();
  const content: unknown = json?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new AiUnavailableError("JSON vazio");
  }
  return JSON.parse(content);
}
