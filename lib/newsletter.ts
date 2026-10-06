/**
 * Lista de "novidades" por e-mail: fica nos Contatos do Resend (o mesmo
 * serviço que já manda os e-mails), sem precisar de banco. Se existir
 * RESEND_SEGMENT_NOVIDADES na Vercel, o contato entra nesse segmento, o que
 * facilita mandar um broadcast só pra quem pediu.
 *
 * Nunca lança: devolve o que aconteceu pra rota decidir o aviso.
 */
export type SubscribeResult = "novo" | "ja_inscrito" | "falhou";

export async function addSubscriber(email: string): Promise<SubscribeResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[novidades] RESEND_API_KEY ausente: inscrição não gravada");
    return "falhou";
  }
  const segment = process.env.RESEND_SEGMENT_NOVIDADES;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.contacts.create({
      email,
      unsubscribed: false,
      ...(segment ? { segments: [{ id: segment }] } : {}),
    });
    if (!error) return "novo";
    // Contato repetido não é erro pra quem se inscreveu de novo
    if (/already exists|duplicate/i.test(error.message ?? "")) return "ja_inscrito";
    console.error("[novidades] Resend recusou o contato:", error);
    return "falhou";
  } catch (e) {
    console.error("[novidades] falha ao gravar contato:", e);
    return "falhou";
  }
}
