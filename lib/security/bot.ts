import { checkBotId } from "botid/server";

/**
 * Vercel BotID no servidor (SPEC de segurança, S2). Em dev o próprio BotID
 * libera (isDevelopment). Se o serviço falhar, deixa passar e loga: perder a
 * checagem por um instante é melhor que barrar cliente de verdade, e o rate
 * limit por IP e o teto diário continuam valendo.
 */
export async function isBotRequest(): Promise<boolean> {
  try {
    const v = await checkBotId();
    return v.isBot && !v.isVerifiedBot;
  } catch (e) {
    console.error("[botid] checagem falhou, deixando passar:", e);
    return false;
  }
}
