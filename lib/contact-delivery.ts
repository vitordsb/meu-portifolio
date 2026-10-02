import * as db from "./db";

/**
 * Entrega de um contato: grava no banco (aparece no /admin) e manda e-mail
 * via Resend quando configurado. Usado pelo modal de contato e pelos leads
 * do orçamento com IA. Nunca lança: falha de um canal não derruba o outro.
 */
export type ContactPayload = {
  name: string;
  email: string | null;
  company: string | null;
  subject: string | null;
  message: string;
};

export async function deliverContact(payload: ContactPayload): Promise<void> {
  // 1) Sempre registra no banco (garante recebimento mesmo sem email configurado)
  try {
    await db.createContactMessage(payload);
  } catch (e) {
    console.error("[contact] falha ao salvar no banco:", e);
    // não aborta, ainda tenta enviar email
  }

  // 2) Envia email via Resend, se configurado
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "vitordsb2019@gmail.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  if (!apiKey) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: payload.email ?? undefined,
      subject: `[Portfolio] ${payload.subject || "Novo contato"} de ${payload.name}`,
      text: [
        `Nome: ${payload.name}`,
        `Email: ${payload.email ?? "(não informado)"}`,
        `Empresa: ${payload.company ?? "(não informada)"}`,
        `Assunto: ${payload.subject ?? "(não informado)"}`,
        "",
        payload.message,
      ].join("\n"),
    });
  } catch (e) {
    console.error("[contact] falha ao enviar email (Resend):", e);
    // banco já tem o registro, segue ok pro usuário
  }
}
