import { initBotId } from "botid/client/core";

/**
 * Vercel BotID (SPEC de segurança, S2): desafio invisível anexado às chamadas
 * abaixo. O servidor confere com `isBotRequest()` (lib/security/bot.ts).
 * Só as rotas que custam dinheiro, mandam e-mail ou expõem pedido. O checkout
 * saiu em 14/out/2026 (ver app/api/pagamentos/checkout/route.ts).
 */
initBotId({
  protect: [
    { path: "/api/orcamento/chat", method: "POST" },
    { path: "/api/orcamento/estimativa", method: "POST" },
    { path: "/api/orcamento/contraproposta", method: "POST" },
    { path: "/api/pagamentos/pedido", method: "GET" },
    { path: "/api/raio-x/analisar", method: "POST" },
    { path: "/api/raio-x/lead", method: "POST" },
    { path: "/api/novidades", method: "POST" },
  ],
});
