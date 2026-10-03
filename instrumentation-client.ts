import { initBotId } from "botid/client/core";

/**
 * Vercel BotID (SPEC de segurança, S2): desafio invisível anexado às chamadas
 * abaixo. O servidor confere com `isBotRequest()` (lib/security/bot.ts).
 * Só as rotas que custam dinheiro, mandam e-mail ou expõem pedido.
 */
initBotId({
  protect: [
    { path: "/api/orcamento/chat", method: "POST" },
    { path: "/api/orcamento/estimativa", method: "POST" },
    { path: "/api/pagamentos/checkout", method: "POST" },
    { path: "/api/pagamentos/pedido", method: "GET" },
  ],
});
