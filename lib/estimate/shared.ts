import type { Scope } from "./scope";

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
  pt: "Oi! Me conta sua ideia: o que o projeto faz e pra quem é?",
  en: "Hi! Tell me your idea: what does the project do and who is it for?",
};

/** Exemplos que giram no texto de exemplo da caixa de digitação. Curtos:
 *  precisam caber numa linha no celular. */
export const INPUT_EXAMPLES = {
  pt: [
    "Ex.: app de agendamento",
    "Ex.: site pra minha clínica",
    "Ex.: sistema de pedidos",
    "Ex.: área de membros",
  ],
  en: [
    "E.g. a booking app",
    "E.g. a clinic website",
    "E.g. an ordering system",
    "E.g. a members area",
  ],
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

/**
 * O que entra no MVP, em linguagem de cliente (sem horas nem fatores). A
 * mesma lista aparece na tela do resultado e no e-mail de confirmação.
 */
export function mvpItems(s: Scope, pt: boolean) {
  const items = s.funcionalidades.map((f) => f.nome);
  if (s.login) items.push(pt ? "Login de usuários" : "User accounts");
  if (s.painel_admin) items.push(pt ? "Painel administrativo" : "Admin panel");
  items.push(...s.integracoes);
  if (s.design !== "pronto")
    items.push(pt ? "Design de interface (UI/UX)" : "Interface design (UI/UX)");
  const platforms = [
    s.plataformas.web && "Web",
    s.plataformas.mobile && (pt ? "App iOS e Android" : "iOS and Android app"),
  ].filter(Boolean) as string[];
  return { items, platforms };
}

/** Os três avisos de "Como esse valor funciona" (tela e e-mail). */
export const PRICE_NOTES = {
  pt: [
    "É o valor de partida da primeira versão (MVP): o essencial pra colocar sua ideia no ar e validar com usuários reais.",
    "O preço final muda conforme o escopo e a nossa conversa. Mais funcionalidades ou mais detalhe aumentam; deixar o que não é essencial pra depois diminui.",
    "Nada aqui é compromisso: o valor fechado sai depois de uma conversa rápida com a gente.",
  ],
  en: [
    "This is the starting price for the first version (MVP): the essentials to launch your idea and validate it with real users.",
    "The final price changes with the scope and our conversation. More features or more detail raise it; leaving non-essentials for later lowers it.",
    "Nothing here is binding: the final price comes after a quick call with me.",
  ],
};

/** "Equipe: 1 profissional dedicado" / "Equipe de 3 profissionais". */
export function teamText(size: number, pt: boolean) {
  if (size <= 1) return pt ? "1 profissional dedicado" : "1 dedicated professional";
  return pt ? `Equipe de ${size} profissionais` : `Team of ${size} professionals`;
}
