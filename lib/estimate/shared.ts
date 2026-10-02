/**
 * O que a página e as rotas do orçamento compartilham. Sem prompt aqui: este
 * arquivo vai pro navegador.
 */

/** Teto duro de mensagens do cliente: depois disso o orçamento sai direto. */
export const MAX_USER_TURNS = 9;

/** Cabe o modelo de briefing preenchido com folga. */
export const MAX_MESSAGE_CHARS = 2500;

/** A saudação aparece fixa na tela (não gasta chamada). */
export const GREETING = {
  pt: "Oi! Eu sou a assistente de orçamentos do Vitor. Me conta a ideia: o que o seu projeto faz e pra quem ele é? Se preferir, use o modelo de briefing aqui embaixo: com ele o orçamento sai mais certeiro.",
  en: "Hi! I'm Vitor's quoting assistant. Tell me the idea: what does your project do and who is it for? If you prefer, use the briefing template below: it makes the quote more accurate.",
};

/**
 * Modelo de briefing (opcional). Entra na caixa de mensagem pra pessoa
 * preencher ali mesmo; quem preenche pula boa parte das perguntas.
 */
export const BRIEFING = {
  pt: `Nome do projeto:
O que ele faz (em 1 ou 2 frases):
Referência parecida (app ou site que lembra a ideia):
Público-alvo:
Principais funcionalidades:
Plataforma (site, app de celular ou os dois):
Escala (regional, nacional ou internacional):
Momento (testando a ideia ou planejado há tempo):
Já tem design ou identidade visual?:
Integrações (pagamento, WhatsApp, sistemas que já usa):
Prazo desejado:`,
  en: `Project name:
What it does (1 or 2 sentences):
Similar reference (an app or site close to the idea):
Target audience:
Main features:
Platform (website, mobile app or both):
Scale (regional, national or international):
Stage (testing the idea or planned for a long time):
Do you have a design or visual identity?:
Integrations (payments, WhatsApp, systems you already use):
Desired deadline:`,
};

/**
 * WhatsApp com mensagem curta: só o primeiro nome e o número do pedido. O
 * resto (escopo, faixa, conversa) já está com o Vitor, achado pelo número.
 */
export function quoteWhatsappText(name: string, code: string, pt: boolean) {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return pt
    ? `Olá! Sou ${first} e quero discutir o orçamento #${code}. Está disponível?`
    : `Hi! I'm ${first} and I'd like to discuss quote #${code}. Are you available?`;
}
