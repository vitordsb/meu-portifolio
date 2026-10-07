type L10n = { pt: string; en: string };

/**
 * Pra onde mandar quem caiu num endereço que não existe. Compara os pedaços
 * do endereço digitado com palavras de cada página (com tolerância a erro de
 * digitação: "/servico", "/orcamneto", "/raiox"). Sem nada parecido, volta
 * pro início.
 */

export type NotFoundTarget = { href: string; label: L10n };

const PAGES: (NotFoundTarget & { keys: string[] })[] = [
  {
    href: "/servicos",
    label: { pt: "Serviços com preço fechado", en: "Fixed-price services" },
    keys: ["servicos", "servico", "services", "service", "pacotes", "pacote", "packages", "planos"],
  },
  {
    href: "/orcamento",
    label: { pt: "Orçamento grátis", en: "Free quote" },
    keys: ["orcamento", "orcamentos", "quote", "budget", "orcar", "estimativa", "estimate", "calculadora"],
  },
  {
    href: "/raio-x",
    label: { pt: "Raio-X grátis do seu site", en: "Free website check" },
    keys: ["raio-x", "raiox", "raio", "xray", "x-ray", "auditoria", "analise", "diagnostico", "audit"],
  },
  {
    href: "/quanto-custa",
    label: { pt: "Quanto custa um site ou app", en: "How much a site or app costs" },
    keys: ["quanto-custa", "quantocusta", "quanto", "custo", "custa", "precos", "preco", "pricing", "price", "valores"],
  },
  {
    href: "/pagar",
    label: { pt: "Pagar pedido", en: "Pay an order" },
    keys: ["pagar", "pagamento", "pay", "payment", "checkout", "boleto", "pix"],
  },
  {
    href: "/#projetos",
    label: { pt: "Projetos entregues", en: "Delivered projects" },
    keys: ["projetos", "projeto", "projects", "project", "portfolio", "portifolio", "cases", "case", "trabalhos", "work"],
  },
  {
    href: "/#como-funciona",
    label: { pt: "Como funciona", en: "How it works" },
    keys: ["como-funciona", "comofunciona", "processo", "process"],
  },
  {
    href: "/#duvidas",
    label: { pt: "Dúvidas frequentes", en: "FAQ" },
    keys: ["duvidas", "duvida", "faq", "perguntas", "ajuda", "help"],
  },
  {
    href: "/privacidade",
    label: { pt: "Política de Privacidade", en: "Privacy Policy" },
    keys: ["privacidade", "privacy", "lgpd", "politica"],
  },
  {
    href: "/termos",
    label: { pt: "Termos de Uso", en: "Terms of Use" },
    keys: ["termos", "termo", "terms"],
  },
];

export const HOME_TARGET: NotFoundTarget = { href: "/", label: { pt: "Início", en: "Home" } };

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

function similarity(token: string, key: string) {
  if (token === key) return 1;
  // Começo igual ("/raio" -> raio-x, "/orcamentos-2026" -> orcamento)
  if (Math.min(token.length, key.length) >= 4 && (token.startsWith(key) || key.startsWith(token))) return 0.9;
  return 1 - distance(token, key) / Math.max(token.length, key.length);
}

/** Pedaços do endereço: "/Serviços/landing_page.html" -> servicos, landing, page, landing-page... */
function tokens(pathname: string) {
  let path = pathname;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    // endereço com % solto: usa como veio
  }
  const out = new Set<string>();
  for (const raw of normalize(path).split("/")) {
    const seg = raw.replace(/\.[a-z0-9]+$/, "");
    if (!seg) continue;
    out.add(seg);
    out.add(seg.replace(/[-_.\s]+/g, "-"));
    out.add(seg.replace(/[-_.\s]+/g, ""));
    for (const part of seg.split(/[-_.\s]+/)) if (part.length >= 3) out.add(part);
  }
  return [...out];
}

/** Página mais parecida com o endereço, ou null quando nada chega perto. */
export function matchNotFound(pathname: string): NotFoundTarget | null {
  let best: { page: NotFoundTarget; score: number } | null = null;
  for (const token of tokens(pathname)) {
    for (const page of PAGES) {
      for (const key of page.keys) {
        const score = similarity(token, key);
        if (!best || score > best.score) best = { page, score };
      }
    }
  }
  return best && best.score >= 0.75 ? { href: best.page.href, label: best.page.label } : null;
}
