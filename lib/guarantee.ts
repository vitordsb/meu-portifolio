/**
 * Garantia do site, num lugar só (home, Dúvidas, páginas de serviço e cards
 * de /servicos leem daqui).
 *
 * Regra do Vitor: só retrabalho, sem devolução de dinheiro (21/out/2026). Em
 * 08/nov/2026 virou regra concreta, com prazo: 30 dias de ajustes grátis
 * depois que o projeto vai ao ar. Garantia vaga convence menos que uma que dá
 * pra entender e acionar (Hart, HBR 1988).
 */

export const ADJUST_DAYS = 30;

/** Frase curta, pra selo e card de preço. */
export const GUARANTEE = {
  pt: `${ADJUST_DAYS} dias de ajustes grátis depois de no ar`,
  en: `${ADJUST_DAYS} days of free adjustments after launch`,
} as const;

/** Resposta da pergunta "E se não ficar como o combinado?". */
export const GUARANTEE_ANSWER = {
  pt: `Depois que o projeto vai ao ar, você tem ${ADJUST_DAYS} dias de ajustes grátis no que foi entregue. E se a entrega não bater com o escopo escrito na proposta, a correção é por nossa conta.`,
  en: `Once the project is live, you get ${ADJUST_DAYS} days of free adjustments to what was delivered. And if the delivery doesn't match the written scope in the proposal, the fix is on us.`,
} as const;
