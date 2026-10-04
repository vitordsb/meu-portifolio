import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Fora do Google: área do Vitor, API e as páginas de pagamento (link de pedido
// e retorno do checkout, que só fazem sentido pra quem recebeu o link).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login", "/api/", "/pagar", "/pagamento/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
