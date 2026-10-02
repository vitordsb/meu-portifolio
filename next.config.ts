import type { NextConfig } from "next";

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
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com${isDev ? " ws: wss:" : ""}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Ninguém coloca o site dentro de um iframe (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
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
};

export default nextConfig;
