/**
 * Envio de e-mail pelo Resend. Remetente vem de CONTACT_FROM_EMAIL (hoje
 * `Vitor de Souza <orcamento@vitordsb.com.br>`, domínio verificado no
 * Resend). Nunca lança: devolve se o envio foi aceito.
 */
export type Email = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  /** Anexos já validados (ex.: imagens do orçamento, regravadas pelo sharp). */
  attachments?: { filename: string; content: Buffer }[];
};

/**
 * Quem recebe os avisos do site (orçamento, Raio-X, contato, pagamento).
 * CONTACT_TO_EMAIL aceita vários, separados por vírgula: cada um recebe o
 * mesmo e-mail (17/out/2026: vitordsb2019 + vantywork).
 */
export function ownerEmails(): string[] {
  const list = (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  return list.length ? list : ["vitordsb2019@gmail.com", "vantywork@gmail.com"];
}

export function senderAddress() {
  return process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
}

export async function sendEmail(mail: Email): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[mail] RESEND_API_KEY ausente: e-mail não enviado");
    return false;
  }

  const from = senderAddress();
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    // O SDK não lança quando o Resend recusa: devolve `error`. Sem olhar
    // isso, remetente não verificado ou destinatário bloqueado somem calados.
    const { error } = await resend.emails.send({ from, ...mail });
    if (error) {
      console.error(
        `[mail] Resend recusou (from=${from}, to=${mail.to}):`,
        error,
      );
      return false;
    }
    return true;
  } catch (e) {
    console.error("[mail] falha ao enviar (Resend):", e);
    return false;
  }
}
