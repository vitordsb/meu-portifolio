/**
 * Mensagem de WhatsApp que pede o depoimento, com o link único dentro.
 * Usada pelo `pnpm depoimento` e pelo aviso de pagamento confirmado.
 */
export function testimonialRequestMessage(link: string, name?: string, project?: string | null): string {
  const firstName = (name ?? "").trim().split(/\s+/)[0];
  return [
    `Oi${firstName ? `, ${firstName}` : ""}! Tudo bem?`,
    `Queria te pedir um favor rápido: um depoimento sobre ${project ? `o projeto ${project}` : "o projeto que fizemos"}.`,
    "Leva uns 2 minutos e você vê como vai ficar antes de enviar:",
    link,
    "Obrigado!",
  ].join("\n");
}
