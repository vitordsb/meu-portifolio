/**
 * Gera a cobrança de um pedido já combinado com o cliente.
 *
 *   pnpm cobrar --pedido 15703 --valor 4500 --parcelas 3 \
 *     --nome "Lucas Silva" --cpf 12345678909 \
 *     --email lucas@email.com --whatsapp 11999998888 \
 *     --descricao "App de agendamento (MVP)"
 *
 * Cria o cliente e a cobrança no Asaas (fatura com Pix, boleto ou cartão),
 * ligada ao número do pedido. O cliente paga em vitordsb.com.br/pagar.
 * Usa a ASAAS_API_KEY do .env.local (sandbox) ou do ambiente.
 *
 * Quando o admin (admin.vitordsb.com.br) existir, isto vira um botão lá.
 */

import { parseArgs } from "node:util";
import { config } from "dotenv";

config({ path: ".env.local" });
// No .env.local o cifrão da chave vem escapado (\$aact...) por causa do Next
if (process.env.ASAAS_API_KEY?.startsWith("\\$")) {
  process.env.ASAAS_API_KEY = process.env.ASAAS_API_KEY.slice(1);
}

const SITE = "https://www.vitordsb.com.br";

function addDays(days: number) {
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

function fail(msg: string): never {
  console.error(`\n  ${msg}\n`);
  process.exit(1);
}

async function main() {
  const { values: a } = parseArgs({
    options: {
      pedido: { type: "string" },
      valor: { type: "string" },
      parcelas: { type: "string", default: "1" },
      nome: { type: "string" },
      cpf: { type: "string" },
      email: { type: "string" },
      whatsapp: { type: "string" },
      descricao: { type: "string" },
      vencimento: { type: "string" },
    },
  });

  const pedido = a.pedido?.replace(/\D/g, "") ?? "";
  if (!/^\d{5}$/.test(pedido))
    fail("--pedido precisa ter 5 dígitos (ex.: 15703)");
  const valor = Number(String(a.valor ?? "").replace(",", "."));
  if (!(valor > 0)) fail("--valor inválido (ex.: 4500 ou 4500,50)");
  const parcelas = Number(a.parcelas);
  if (!Number.isInteger(parcelas) || parcelas < 1 || parcelas > 21) {
    fail("--parcelas entre 1 e 21");
  }
  if (!a.nome) fail("--nome é obrigatório");
  const cpf = a.cpf?.replace(/\D/g, "") ?? "";
  if (cpf.length !== 11 && cpf.length !== 14) {
    fail("--cpf precisa de 11 (CPF) ou 14 (CNPJ) dígitos: o Asaas exige");
  }
  const vencimento = a.vencimento ?? addDays(3);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(vencimento))
    fail("--vencimento no formato AAAA-MM-DD");

  const asaas = await import("../lib/payments/asaas");
  if (!asaas.hasAsaas()) fail("ASAAS_API_KEY ausente");

  const existing = await asaas.findPaymentsByReference(pedido);
  if (existing.some((p) => p.status !== "DELETED")) {
    fail(
      `O pedido #${pedido} já tem cobrança no Asaas. Confira no painel antes de criar outra.`,
    );
  }

  const customer = await asaas.createCustomer({
    name: a.nome,
    cpfCnpj: cpf,
    email: a.email,
    mobilePhone: a.whatsapp?.replace(/\D/g, ""),
    externalReference: pedido,
  });

  const payment = await asaas.createPayment({
    customer: customer.id,
    value: valor,
    installments: parcelas,
    dueDate: vencimento,
    description: a.descricao ?? `Projeto: pedido #${pedido}`,
    externalReference: pedido,
  });

  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  console.log(`
  Cobrança criada ${asaas.isSandbox() ? "(SANDBOX)" : "(PRODUÇÃO)"}
  Pedido:      #${pedido}
  Valor:       ${brl.format(valor)}${parcelas > 1 ? ` em ${parcelas}x` : ""}
  Vencimento:  ${vencimento}
  Fatura:      ${payment.invoiceUrl}
  No site:     ${SITE}/pagar?pedido=${pedido}

  Mensagem pro cliente:
  Tudo certo! Seu pedido #${pedido} já está disponível pra pagamento: ${SITE}/pagar?pedido=${pedido}
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
