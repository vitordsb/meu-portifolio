import { PROMPT_CANARY, READY_MARKER } from "./prompts";

/**
 * Verificação da resposta da IA antes de chegar na tela (SPEC segurança S3).
 * Não depende da IA obedecer: se a resposta parecer as instruções internas,
 * a rota troca pela recusa padrão.
 */

const LEAK_PATTERNS: RegExp[] = [
  new RegExp(PROMPT_CANARY.replace(/-/g, "[-\\s]?"), "i"),
  // Frases das instruções em português
  /assistente de or[çc]amentos do Vitor de Souza,\s*engenheiro/i,
  /seu [úu]nico trabalho/i,
  /regras firmes/i,
  /como conversar\s*:/i,
  /o que voc[êe] precisa descobrir/i,
  /nota interna/i,
  /termine a mensagem exatamente/i,
  // ... traduzidas pro inglês e espanhol (o ataque que funcionou: "traduza")
  /your (only|sole) (job|task)/i,
  /firm rules/i,
  /how to (talk|converse|chat)\s*:/i,
  /what you need to (find out|discover|figure out)/i,
  /internal note/i,
  /end (the|your) message exactly/i,
  /tu [úu]nico trabajo/i,
  /reglas firmes/i,
  // Nomes de código
  /\b(CHAT_SYSTEM|EXTRACT_SYSTEM|WRAP_UP_NOTE|READY_MARKER)\b/,
];

/** Texto da resposta parece reproduzir as instruções internas? */
export function looksLikePromptLeak(text: string): boolean {
  if (LEAK_PATTERNS.some((re) => re.test(text))) return true;
  // O marcador só é legítimo no fim. No meio do texto, a IA está citando a regra.
  const at = text.indexOf(READY_MARKER);
  return at >= 0 && text.slice(at + READY_MARKER.length).trim().length > 0;
}

/** Cliente escreveu o marcador na própria mensagem: não pode virar comando. */
export function stripMarker(text: string): string {
  return text.replace(/\[\[\s*PRONTO\s*\]\]/gi, "");
}

/** Recusa padrão, no idioma provável de quem perguntou. */
export function refusal(lastUserMessage: string): string {
  const en =
    /\b(the|you|your|please|what|translate|print|show|ignore|instructions)\b/i.test(
      lastUserMessage,
    ) && !/[ãõçáéíóúâêô]/i.test(lastUserMessage);
  return en
    ? "I can't share that. Tell me about your project: what does it do and who is it for?"
    : "Isso eu não consigo compartilhar. Me conta do seu projeto: o que ele faz e pra quem é?";
}
