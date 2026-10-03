import {
  ConversationSchema,
  countUserTurns,
  noDashes,
} from "@/lib/estimate/conversation";
import {
  AiUnavailableError,
  hasAiKey,
  streamChat,
} from "@/lib/estimate/deepseek";
import { isDevMock, mockChat } from "@/lib/estimate/dev-mock";
import { isBotRequest } from "@/lib/security/bot";
import { takeDaily } from "@/lib/security/daily-cap";
import { guard, json } from "@/lib/estimate/guard";
import {
  looksLikePromptLeak,
  refusal,
  stripMarker,
} from "@/lib/estimate/guardrails";
import {
  CHAT_SYSTEM,
  MAX_USER_TURNS,
  READY_MARKER,
  WRAP_UP_AT,
  WRAP_UP_NOTE,
  imageNote,
} from "@/lib/estimate/prompts";

/**
 * Um turno da conversa. Responde em NDJSON, uma linha por evento:
 *   {"t":"d","v":"texto"}       pedaço da resposta
 *   {"t":"end","ready":true}    fim; ready = já dá pra gerar o orçamento
 *   {"t":"err"}                 a IA caiu no meio
 */

export const maxDuration = 60;

/** Antes disso o marcador da IA é ignorado: não há escopo pra orçar. */
const MIN_TURNS_FOR_READY = 2;

export async function POST(req: Request) {
  const blocked = guard(req, "orc-chat", 40, 60 * 60 * 1000);
  if (blocked) return blocked;

  // Robô (BotID) e teto diário global: o que o rate limit por IP não pega
  if (await isBotRequest()) return json({ error: "forbidden" }, 403);

  const body = await req.json().catch(() => null);
  const parsed = ConversationSchema.safeParse(body?.messages);
  if (!parsed.success) return json({ error: "invalid" }, 400);

  const msgs = parsed.data;
  if (msgs[msgs.length - 1].role !== "user")
    return json({ error: "invalid" }, 400);

  const turns = countUserTurns(msgs);
  if (turns > MAX_USER_TURNS) return json({ error: "too_long" }, 400);

  const mock = isDevMock();
  if (!mock && !hasAiKey()) return json({ error: "unavailable" }, 503);
  // Só conta turno válido (depois do schema): lixo não gasta o teto
  if (!(await takeDaily("chat")).ok) return json({ error: "unavailable" }, 503);

  // A nota de "hora de fechar" vai colada na última mensagem: o prefixo
  // (system + histórico) fica igual entre turnos e cai no cache da DeepSeek.
  // Marcador digitado pelo cliente não pode virar comando (SPEC S7)
  // Contagem de imagens vira uma nota escrita pelo servidor (o arquivo não
  // vem pra cá); o campo `images` não segue pra DeepSeek.
  const history = msgs.map(({ role, content, images }) =>
    role === "user"
      ? {
          role,
          content: images
            ? `${stripMarker(content)}\n\n${imageNote(images)}`
            : stripMarker(content),
        }
      : { role, content },
  );
  if (turns >= WRAP_UP_AT) {
    const last = history[history.length - 1];
    last.content = `${last.content}\n\n${WRAP_UP_NOTE}`;
  }

  const pieces = mock
    ? mockChat(turns)
    : streamChat([{ role: "system", content: CHAT_SYSTEM }, ...history], {
        maxTokens: 400,
        signal: req.signal,
      });

  const encoder = new TextEncoder();
  const send = (ctrl: ReadableStreamDefaultController, event: object) =>
    ctrl.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));

  const stream = new ReadableStream({
    async start(ctrl) {
      // Segura o fim do texto: o marcador nunca aparece pela metade e o
      // verificador de vazamento (SPEC S3) olha cada trecho antes de ele ir
      // pra tela. Vazou: corta o stream e manda a recusa no lugar.
      const hold = Math.max(READY_MARKER.length, 160);
      let full = "";
      let sent = 0;
      const lastUser = msgs[msgs.length - 1].content;

      try {
        for await (const piece of pieces) {
          full += piece;
          if (looksLikePromptLeak(full)) {
            console.warn("[orcamento] resposta bloqueada: parecia o prompt");
            send(ctrl, { t: "replace", v: refusal(lastUser) });
            send(ctrl, { t: "end", ready: false });
            return;
          }
          const safeEnd = full.length - hold;
          if (safeEnd > sent) {
            send(ctrl, { t: "d", v: noDashes(full.slice(sent, safeEnd)) });
            sent = safeEnd;
          }
        }

        // Marcador só vale a partir do 2º turno: no 1º não tem escopo (SPEC S7)
        const ready =
          (full.includes(READY_MARKER) && turns >= MIN_TURNS_FOR_READY) ||
          turns >= MAX_USER_TURNS;
        const clean = full.replace(READY_MARKER, "");
        const rest = clean.slice(sent).trimEnd();
        if (rest) send(ctrl, { t: "d", v: noDashes(rest) });
        send(ctrl, { t: "end", ready });
      } catch (e) {
        if (!(e instanceof AiUnavailableError)) {
          console.error("[orcamento] falha no stream:", e);
        }
        send(ctrl, { t: "err" });
      } finally {
        ctrl.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
