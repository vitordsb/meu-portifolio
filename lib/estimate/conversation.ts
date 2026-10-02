import { z } from "zod";
import { cleanText } from "@/lib/sanitize";
import { MAX_MESSAGE_CHARS, MAX_USER_TURNS } from "./shared";

/**
 * O histórico vem do navegador, então é entrada não confiável: tamanho de
 * cada mensagem, quantidade e total são limitados aqui, antes de virar custo
 * de API. Forjar mensagens da assistente não ganha nada: o preço sai do
 * código e o Vitor lê a conversa antes de fechar qualquer coisa.
 */

const MAX_TOTAL_CHARS = 20_000;

export const ConversationSchema = z
  .array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z
        .string()
        .transform(cleanText)
        .pipe(
          z
            .string()
            .trim()
            .min(1)
            .max(MAX_MESSAGE_CHARS * 2),
        ),
    }),
  )
  .min(1)
  .max(MAX_USER_TURNS * 2 + 2)
  .refine(
    (msgs) => msgs.reduce((n, m) => n + m.content.length, 0) <= MAX_TOTAL_CHARS,
    "Conversa longa demais.",
  )
  .refine(
    (msgs) =>
      msgs.every(
        (m) => m.role !== "user" || m.content.length <= MAX_MESSAGE_CHARS,
      ),
    "Mensagem longa demais.",
  );

export type Conversation = z.infer<typeof ConversationSchema>;

export function countUserTurns(msgs: Conversation) {
  return msgs.filter((m) => m.role === "user").length;
}

/** Transcrição em texto corrido, pra extração e pro e-mail do lead. */
export function transcript(msgs: Conversation) {
  return msgs
    .map((m) => `${m.role === "user" ? "Cliente" : "Assistente"}: ${m.content}`)
    .join("\n\n");
}

/** O Vitor não quer travessão em lugar nenhum, nem no texto da IA. */
export function noDashes(text: string) {
  return text.replace(/[\u2013\u2014\u2212]/g, "-");
}
