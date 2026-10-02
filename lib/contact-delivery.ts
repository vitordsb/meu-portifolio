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
  let saved = false;
  let mailed = false;

  // 1) Sempre registra no banco (garante recebimento mesmo sem email configurado)
  try {
    await db.createContactMessage(payload);
    saved = true;
  } catch (e) {
    console.error("[contact] falha ao salvar no banco:", e);
    // não aborta, ainda tenta enviar email
  }

  // 2) Envia email via Resend, se configurado
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "vitordsb2019@gmail.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY ausente: e-mail não enviado");
  } else {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      // O SDK não lança quando o Resend recusa: devolve `error`. Sem olhar
      // isso, remetente não verificado ou destinatário bloqueado somem calados.
      const { error } = await resend.emails.send({
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
      if (error) {
        console.error(
          `[contact] Resend recusou (from=${from}, to=${to}):`,
          error,
        );
      } else {
        mailed = true;
      }
    } catch (e) {
      console.error("[contact] falha ao enviar email (Resend):", e);
    }
  }

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
