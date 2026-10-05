/**
 * O que a página e o e-mail do Raio-X dividem. Arquivo leve de propósito:
 * a página importa daqui sem levar junto o HTML do e-mail.
 */

export function raioXWhatsappText(name: string, code: string, pt: boolean) {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return pt
    ? `Olá, ${first ? `sou ${first}. ` : ""}Fiz o raio-x #${code} do meu site e quero conversar sobre as melhorias.`
    : `Hi, ${first ? `I'm ${first}. ` : ""}I ran site check #${code} and want to talk about the improvements.`;
}
