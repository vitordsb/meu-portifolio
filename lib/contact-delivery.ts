import * as db from "./db";
import { sendEmail } from "./mailer";

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

export async function deliverContact(
  payload: ContactPayload,
  attachments?: { filename: string; content: Buffer }[],
): Promise<void> {
  let saved = false;

  // 1) Sempre registra no banco (garante recebimento mesmo sem email configurado)
  try {
    await db.createContactMessage(payload);
    saved = true;
  } catch (e) {
    console.error("[contact] falha ao salvar no banco:", e);
    // não aborta, ainda tenta enviar email
  }

  // 2) Avisa o Vitor por e-mail (Resend)
  const mailed = await sendEmail({
    to: process.env.CONTACT_TO_EMAIL ?? "vitordsb2019@gmail.com",
    replyTo: payload.email ?? undefined,
    attachments: attachments?.length ? attachments : undefined,
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

  // Última rede: nenhum canal funcionou. O log da Vercel guarda o contato
  // pra ele não se perder de vez enquanto banco/e-mail são consertados.
  if (!saved && !mailed) {
    console.error(
      "[contact] CONTATO NÃO ENTREGUE (sem banco e sem e-mail):",
      JSON.stringify({
        assunto: payload.subject,
        nome: payload.name,
        email: payload.email,
        mensagem: payload.message.slice(0, 1500),
      }),
    );
  }
}
