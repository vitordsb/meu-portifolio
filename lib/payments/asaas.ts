/**
 * Cliente mínimo do Asaas (API v3). Só roda no servidor: a chave nunca vai
 * pro navegador.
 *
 * Env:
 *   ASAAS_API_KEY        `$aact_hmlg_...` = sandbox, `$aact_prod_...` = produção.
 *                        O ambiente sai do prefixo: chave no ambiente errado
 *                        devolve 401 `invalid_environment`.
 *   ASAAS_WEBHOOK_TOKEN  token que o Asaas manda no header `asaas-access-token`.
 *
 * Referência: docs.asaas.com (consultada em 02/out/2026).
 */

const USER_AGENT = "vitordsb.com.br/1.0";

export class AsaasError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly detail: unknown,
  ) {
    super(message);
  }
}

export function hasAsaas() {
  return Boolean(process.env.ASAAS_API_KEY);
}

export function isSandbox() {
  return (process.env.ASAAS_API_KEY ?? "").startsWith("$aact_hmlg_");
}

function baseUrl() {
  return isSandbox()
    ? "https://api-sandbox.asaas.com/v3"
    : "https://api.asaas.com/v3";
}

async function call<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
): Promise<T> {
  const key = process.env.ASAAS_API_KEY;
  if (!key) throw new AsaasError("ASAAS_API_KEY ausente", 0, null);

  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      access_token: key,
      // Obrigatório pra contas criadas a partir de 13/06/2024
      "User-Agent": USER_AGENT,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    console.error(
      `[asaas] ${method} ${path} ${res.status}:`,
      JSON.stringify(data),
    );
    throw new AsaasError(`Asaas ${res.status}`, res.status, data);
  }
  return data as T;
}

// ── Tipos (só os campos que usamos) ───────────────────────────────────────────

export type AsaasPayment = {
  id: string;
  customer: string;
  value: number;
  netValue?: number;
  status: string;
  billingType: string;
  description?: string | null;
  externalReference?: string | null;
  invoiceUrl: string;
  dueDate: string;
  installment?: string | null;
  installmentNumber?: number | null;
  checkoutSession?: string | null;
};

export type AsaasCustomer = {
  id: string;
  name: string;
  email?: string | null;
  mobilePhone?: string | null;
};

// ── Checkout (pacotes) ────────────────────────────────────────────────────────

/**
 * Sessão de checkout hospedada pelo Asaas: Pix e cartão (até 21x), sem
 * boleto. Quem paga preenche os próprios dados (CPF incluso) na página deles.
 */
export async function createCheckout(input: {
  itemName: string;
  description: string;
  value: number;
  maxInstallments: number;
  externalReference: string;
  successUrl: string;
  cancelUrl: string;
  expiredUrl: string;
  minutesToExpire?: number;
}) {
  const installments = Math.max(1, Math.min(21, input.maxInstallments));
  const res = await call<{ id: string; link?: string; url?: string }>(
    "POST",
    "/checkouts",
    {
      billingTypes: ["PIX", "CREDIT_CARD"],
      chargeTypes:
        installments > 1 ? ["DETACHED", "INSTALLMENT"] : ["DETACHED"],
      minutesToExpire: input.minutesToExpire ?? 60,
      externalReference: input.externalReference,
      callback: {
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
        expiredUrl: input.expiredUrl,
      },
      items: [
        {
          // O Asaas corta em 30 caracteres
          name: input.itemName.slice(0, 30),
          description: input.description.slice(0, 150),
          quantity: 1,
          value: input.value,
        },
      ],
      ...(installments > 1
        ? { installment: { maxInstallmentCount: installments } }
        : {}),
    },
  );

  const url =
    res.link ??
    res.url ??
    `${isSandbox() ? "https://sandbox.asaas.com" : "https://asaas.com"}/checkoutSession/show?id=${res.id}`;
  return { id: res.id, url };
}

// ── Cobrança avulsa (pedido combinado) ────────────────────────────────────────

export async function createCustomer(input: {
  name: string;
  cpfCnpj: string;
  email?: string;
  mobilePhone?: string;
  externalReference?: string;
}) {
  return call<AsaasCustomer>("POST", "/customers", input);
}

export async function createPayment(input: {
  customer: string;
  value: number;
  dueDate: string;
  description: string;
  externalReference: string;
  installments?: number;
  successUrl?: string;
}) {
  const n = Math.max(1, input.installments ?? 1);
  return call<AsaasPayment>("POST", "/payments", {
    customer: input.customer,
    // O pagador escolhe Pix, boleto ou cartão na fatura
    billingType: "UNDEFINED",
    dueDate: input.dueDate,
    description: input.description.slice(0, 500),
    externalReference: input.externalReference,
    ...(n > 1
      ? { installmentCount: n, totalValue: input.value }
      : { value: input.value }),
    ...(input.successUrl
      ? { callback: { successUrl: input.successUrl, autoRedirect: true } }
      : {}),
  });
}

export async function findPaymentsByReference(ref: string) {
  const res = await call<{ data: AsaasPayment[] }>(
    "GET",
    `/payments?externalReference=${encodeURIComponent(ref)}&limit=100`,
  );
  return res.data ?? [];
}

export async function getCustomer(id: string) {
  return call<AsaasCustomer>("GET", `/customers/${encodeURIComponent(id)}`);
}

/** Só no sandbox: marca a cobrança como paga, pra testar o webhook. */
export async function sandboxConfirm(paymentId: string) {
  return call(
    "POST",
    `/sandbox/payment/${encodeURIComponent(paymentId)}/confirm`,
  );
}

/**
 * Parcelamento (cartão parcelado gera N cobranças ligadas a um `installment`).
 * Usado pra mostrar o total e o número de parcelas no aviso de pagamento.
 */
export async function getInstallment(id: string) {
  return call<{ id: string; value?: number; installmentCount?: number }>(
    "GET",
    `/installments/${encodeURIComponent(id)}`,
  );
}
