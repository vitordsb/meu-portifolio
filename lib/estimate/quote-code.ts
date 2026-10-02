import { randomInt } from "node:crypto";
import { contactSubjectExists } from "@/lib/db";

/**
 * Número do pedido de orçamento (#48213). É o que o cliente manda no WhatsApp
 * no lugar de uma mensagem longa; o Vitor acha o pedido no /admin (assunto do
 * contato) ou buscando "#48213" no e-mail.
 *
 * Aleatório de 5 dígitos, não sequencial: não revela quantos pedidos
 * existem e não dá pra chutar o do vizinho.
 */

export function quoteSubject(code: string) {
  return `Orçamento com IA #${code}`;
}

export async function newQuoteCode(): Promise<string> {
  let code = String(randomInt(10_000, 100_000));
  for (let i = 0; i < 5; i++) {
    try {
      // null = sem banco: não tem com o que colidir, o e-mail leva o número
      const taken = await contactSubjectExists(quoteSubject(code));
      if (!taken) return code;
    } catch {
      return code;
    }
    code = String(randomInt(10_000, 100_000));
  }
  return code;
}
