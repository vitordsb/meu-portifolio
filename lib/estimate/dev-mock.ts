import { READY_MARKER } from "./prompts";
import type { Scope } from "./scope";

/**
 * Respostas de mentira pra testar a tela em dev sem chave da DeepSeek.
 * Só entra com NODE_ENV !== "production" e sem DEEPSEEK_API_KEY: em produção
 * a falta da chave vira "indisponível", nunca resposta inventada.
 */

export function isDevMock() {
  return process.env.NODE_ENV !== "production" && !process.env.DEEPSEEK_API_KEY;
}

const SCRIPT = [
  "Legal! E quais são as principais coisas que a pessoa consegue fazer nele? Tipo agendar, pagar, conversar...",
  "Entendi. Vai ser um site, um app de celular ou os dois?",
  "Você já tem identidade visual, layout pronto ou alguma referência de app que goste?",
];

export async function* mockChat(userTurns: number): AsyncGenerator<string> {
  const text =
    userTurns <= SCRIPT.length
      ? SCRIPT[userTurns - 1]
      : `Perfeito, já entendi o projeto:\n- App de agendamento para clientes\n- Pagamento online\n- Lembretes por WhatsApp\n- Painel para o dono gerenciar a agenda\n\nO valor de partida da primeira versão (MVP) já pode ser gerado. ${READY_MARKER}`;

  // Simula o stream: palavra a palavra, com a latência de uma API real
  for (const word of text.split(/(?<= )/)) {
    await new Promise((r) => setTimeout(r, 25));
    yield word;
  }
}

export const MOCK_SCOPE: Scope = {
  resumo:
    "App de agendamento com pagamento online, lembretes por WhatsApp e painel para o dono.",
  tipo: "app_mobile",
  plataformas: { web: true, mobile: true },
  design: "referencias",
  funcionalidades: [
    { nome: "Agendamento de horários", complexidade: "media" },
    { nome: "Pagamento online", complexidade: "complexa" },
    { nome: "Histórico do cliente", complexidade: "simples" },
  ],
  integracoes: ["Gateway de pagamento", "WhatsApp"],
  escala: "regional",
  fase: "validando",
  login: true,
  painel_admin: true,
  urgente: false,
  confianca: "media",
};
