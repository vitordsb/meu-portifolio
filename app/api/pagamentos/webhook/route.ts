import { timingSafeEqual } from "node:crypto";
import { after } from "next/server";
import { sendEmail } from "@/lib/mailer";
import {
  getCustomer,
  getInstallment,
  type AsaasPayment,
} from "@/lib/payments/asaas";
import {
  clientPaidEmail,
  ownerPaidEmail,
  type PaidInfo,
} from "@/lib/payments/emails";
import { findPackage } from "@/lib/payments/packages";

/**
 * Webhook do Asaas: avisa o Vitor e o cliente quando um pagamento confirma.
 *
 * Regras do Asaas (docs.asaas.com, 02/out/2026):
 * - Autentica pelo header `asaas-access-token` (= ASAAS_WEBHOOK_TOKEN).
 * - Precisa de HTTP 200 exato em até 10 s, senão vira falha; 15 falhas
 *   seguidas pausam a fila. Por isso responde na hora e trabalha em `after`.
 * - Entrega "pelo menos uma vez": pode repetir. Sem banco ainda, repetição
 *   rara vira e-mail duplicado (aceito por enquanto).
 *
 * Quando avisar:
 * - Cartão e boleto: CONFIRMED -> RECEIVED. Avisa no CONFIRMED.
 * - Pix: vai direto pra RECEIVED. Avisa no RECEIVED de Pix.
 * - Cartão parcelado: todas as parcelas confirmam juntas; avisa só na 1ª,
 *   com o total.
 */

function tokenOk(received: string | null) {
  const expected = process.env.ASAAS_WEBHOOK_TOKEN ?? "";
  if (!expected || !received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function shouldNotify(event: string, p: AsaasPayment) {
  if (p.billingType === "CREDIT_CARD" && (p.installmentNumber ?? 1) > 1) {
    return false;
  }
  if (event === "PAYMENT_CONFIRMED") return true;
  if (event === "PAYMENT_RECEIVED") {
    return p.billingType === "PIX" || p.status === "RECEIVED_IN_CASH";
  }
  return false;
}

/** "Parcela 1 de 3. Site institucional" -> "Site institucional" */
function cleanDescription(d: string | null | undefined) {
  return (d ?? "").replace(/^Parcela \d+ de \d+\.\s*/i, "").trim();
}

async function notify(p: AsaasPayment) {
  // "48213:landing" (pacote) ou "48213" (pedido combinado)
  const [code, pkgId] = (p.externalReference ?? "").split(":");
  const pkg = pkgId ? findPackage(pkgId) : null;

  let value = p.value;
  let installments: string | null = null;
  if (p.installment && p.billingType === "CREDIT_CARD") {
    try {
      const inst = await getInstallment(p.installment);
      if (inst.value) value = inst.value;
      if (inst.installmentCount && inst.installmentCount > 1) {
        installments = `${inst.installmentCount}x`;
      }
    } catch {
      // segue com o valor da parcela
    }
  } else if (p.installment && p.installmentNumber) {
    // Pedido combinado em boleto/Pix parcelado: cada parcela é um aviso
    installments = `parcela ${p.installmentNumber}`;
  }

  let customer: Awaited<ReturnType<typeof getCustomer>> | null = null;
  try {
    customer = await getCustomer(p.customer);
  } catch {
    // aviso pro Vitor sai mesmo sem os dados do cliente
  }

  const info: PaidInfo = {
    code: code || p.id,
    name: customer?.name ?? "Cliente",
    email: customer?.email ?? null,
    phone: customer?.mobilePhone ?? null,
    value,
    billingType: p.billingType,
    description: pkg?.name.pt || cleanDescription(p.description) || "Pagamento",
    installments,
    invoiceUrl: p.invoiceUrl,
  };

  await sendEmail({
    to: process.env.CONTACT_TO_EMAIL ?? "vitordsb2019@gmail.com",
    replyTo: info.email ?? undefined,
    ...ownerPaidEmail(info),
  });
  if (info.email) {
    await sendEmail({ to: info.email, ...clientPaidEmail(info) });
  }
}

export async function POST(req: Request) {
  if (!tokenOk(req.headers.get("asaas-access-token"))) {
    return new Response("unauthorized", { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const event = String(body?.event ?? "");
  const payment = body?.payment as AsaasPayment | undefined;

  if (payment?.id && shouldNotify(event, payment)) {
    after(() =>
      notify(payment).catch((e) =>
        console.error(`[pagamentos] aviso de ${payment.id} falhou:`, e),
      ),
    );
  }

  // 200 exato sempre que autenticado: 201/204 contam como falha pro Asaas
  return new Response("ok", { status: 200 });
}
