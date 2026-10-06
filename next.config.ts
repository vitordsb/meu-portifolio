import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

/**
 * Cabeçalhos de segurança (SPEC de segurança, S4).
 *
 * CSP com 'unsafe-inline' em script: o App Router injeta scripts inline e a
 * alternativa (nonce por requisição) deixaria todas as páginas dinâmicas. Ela
 * ainda barra script de outro domínio, plugin, <base> trocado e formulário
 * postando pra fora. 'unsafe-eval' só no dev (o Next precisa pra recarregar).
 *
 * img-src aceita https: porque páginas internas mostram capas e ícones vindos
 * do banco por <img> comum (sem passar pelo otimizador).
 */
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://cloud.umami.is`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://gateway.umami.is${isDev ? " ws: wss:" : ""}`,
  // BotID usa quadro e worker do próprio site (rota interna proxiada pela
  // Vercel): 'self' libera ele e continua barrando outros domínios.
  "frame-src 'self'",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Outro site não coloca este dentro de um iframe (clickjacking). SAMEORIGIN
  // e não DENY: o desafio do BotID roda num quadro do próprio site.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Microfone só no próprio site: ditado por voz do orçamento (o navegador
  // ainda pergunta à pessoa antes de ligar). O resto segue desligado.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Só HTTPS por 2 anos, subdomínios inclusos (admin.vitordsb.com.br já nasce assim)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Botão "N" do Next (só em dev) no único canto livre: o esquerdo tem o
  // avatar-menu e o superior direito, a busca no celular.
  devIndicators: { position: "bottom-right" },
  // Sem cabeçalho "X-Powered-By: Next.js": não entrega a stack de graça
  poweredByHeader: false,
  images: {
    // Só imagens do próprio site passam pelo otimizador (SPEC S5). Antes era
    // hostname "**": qualquer um usava o servidor pra baixar e processar
    // imagem de qualquer lugar. Hoje só a foto do banner usa next/image, e é
    // arquivo local.
    remotePatterns: [],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Páginas pessoais do portfólio antigo (06/out/2026: o site fala como
  // empresa e não mostra mais o Vitor como pessoa). Temporário (307) de
  // propósito: se ele quiser um currículo pessoal de volta, é só tirar daqui.
  // As páginas seguem no código em app/(public).
  async redirects() {
    const toProjects = ["/projects", "/autonomo", "/freelance"];
    const toHome = ["/about", "/cv", "/skills", "/competencies", "/certificates", "/github", "/contact"];
    return [
      ...toProjects.map((source) => ({ source, destination: "/#projetos", permanent: false })),
      ...toHome.map((source) => ({ source, destination: "/", permanent: false })),
    ];
  },
};

// withBotId cria as rotas internas do desafio anti-robô (SPEC S2)
export default withBotId(nextConfig);
