import type { Category, Impact } from "./types";

/**
 * Tradução dos achados do Lighthouse pra quem é dono de site, não dev.
 * "Elimine recursos que impedem a renderização" não vende nada; "o site
 * fica em branco esperando arquivos" sim.
 *
 * Vários audits do Lighthouse falam da mesma coisa (o antigo e o "insight"
 * novo, ou cinco jeitos de dizer "imagem pesada"): `group` junta tudo num
 * item só. Achado fora desta lista entra com o título do próprio Lighthouse
 * (que já vem no idioma pedido) e o texto genérico da categoria.
 */

type L10n = { pt: string; en: string };

export type IssueCopy = {
  group: string;
  cat: Category;
  /** Peso fixo; sem ele, sai da economia de tempo ou do peso no Lighthouse. */
  impact?: Impact;
  title: L10n;
  why: L10n;
  fix: L10n;
};

const IMAGENS: Omit<IssueCopy, "group"> = {
  cat: "performance",
  title: { pt: "Imagens pesadas demais", en: "Images are too heavy" },
  why: {
    pt: "No 4G, foto grande é a principal causa de site lento. Enquanto ela baixa, o visitante encara a tela vazia.",
    en: "On mobile data, oversized photos are the top cause of slow sites. While they download, visitors stare at an empty screen.",
  },
  fix: {
    pt: "Converter pra WebP/AVIF, entregar no tamanho da tela e carregar só quando aparecer.",
    en: "Convert to WebP/AVIF, serve them at screen size and lazy-load what's below the fold.",
  },
};

const CACHE: Omit<IssueCopy, "group"> = {
  cat: "performance",
  title: {
    pt: "O site baixa tudo de novo a cada visita",
    en: "The site re-downloads everything on every visit",
  },
  why: {
    pt: "Quem volta pro site (o cliente que está quase fechando) espera o mesmo tempo da primeira vez.",
    en: "Returning visitors (the ones about to buy) wait as long as first-timers.",
  },
  fix: {
    pt: "Configurar cache no servidor pra imagens, fontes e scripts.",
    en: "Set up server caching for images, fonts and scripts.",
  },
};

const BLOQUEIO: Omit<IssueCopy, "group"> = {
  cat: "performance",
  title: {
    pt: "A página fica em branco esperando arquivos",
    en: "The page stays blank waiting for files",
  },
  why: {
    pt: "Antes de mostrar qualquer coisa, o navegador espera estilos e scripts que nem são da primeira tela.",
    en: "Before showing anything, the browser waits for styles and scripts that aren't even needed above the fold.",
  },
  fix: {
    pt: "Carregar primeiro só o essencial da primeira tela e adiar o resto.",
    en: "Load only what the first screen needs and defer the rest.",
  },
};

const JS: Omit<IssueCopy, "group"> = {
  cat: "performance",
  title: {
    pt: "Código sobrando deixando o site lento",
    en: "Unused code slowing the site down",
  },
  why: {
    pt: "Plugin e script que a página nem usa são baixados e processados no celular, que trava ao tocar.",
    en: "Plugins and scripts the page doesn't use still get downloaded and run on the phone, which freezes on tap.",
  },
  fix: {
    pt: "Remover plugins e scripts sem uso e dividir o código por página.",
    en: "Remove unused plugins and scripts and split code per page.",
  },
};

const TERCEIROS: Omit<IssueCopy, "group"> = {
  cat: "performance",
  title: {
    pt: "Ferramentas de terceiros pesando no carregamento",
    en: "Third-party tools weighing down the load",
  },
  why: {
    pt: "Chat, pixel, mapa e vídeo embutido disputam a internet do visitante com o seu conteúdo.",
    en: "Chat widgets, pixels, maps and embedded videos fight your content for the visitor's bandwidth.",
  },
  fix: {
    pt: "Carregar essas ferramentas depois da página aberta, ou só quando forem usadas.",
    en: "Load these tools after the page is up, or only when they're used.",
  },
};

const FONTES: Omit<IssueCopy, "group"> = {
  cat: "performance",
  title: {
    pt: "Texto invisível enquanto a fonte carrega",
    en: "Text is invisible while the font loads",
  },
  why: {
    pt: "O visitante vê a página sem texto por alguns segundos e acha que travou.",
    en: "Visitors see a page without text for a few seconds and think it froze.",
  },
  fix: {
    pt: "Mostrar o texto na hora com uma fonte do sistema e trocar quando a fonte chegar.",
    en: "Show text right away with a system font and swap when the web font arrives.",
  },
};

const SERVIDOR: Omit<IssueCopy, "group"> = {
  cat: "performance",
  title: { pt: "Servidor demora pra responder", en: "The server is slow to respond" },
  why: {
    pt: "Antes de qualquer imagem, o visitante já perde tempo esperando a hospedagem responder.",
    en: "Before any image loads, visitors already lose time waiting for the hosting to answer.",
  },
  fix: {
    pt: "Hospedagem melhor ou com CDN e páginas geradas com antecedência.",
    en: "Better hosting or a CDN, with pages pre-rendered ahead of time.",
  },
};

const CLS: Omit<IssueCopy, "group"> = {
  cat: "performance",
  impact: "medio",
  title: {
    pt: "O layout pula enquanto carrega",
    en: "The layout jumps while loading",
  },
  why: {
    pt: "O botão muda de lugar na hora do toque e a pessoa clica no lugar errado. Passa sensação de site amador.",
    en: "Buttons move right when people tap, so they hit the wrong thing. It feels amateurish.",
  },
  fix: {
    pt: "Reservar o espaço de imagens, anúncios e banners antes de carregarem.",
    en: "Reserve space for images, ads and banners before they load.",
  },
};

const TRAVA: Omit<IssueCopy, "group"> = {
  cat: "performance",
  impact: "medio",
  title: {
    pt: "O site trava quando a pessoa toca",
    en: "The site freezes when people tap",
  },
  why: {
    pt: "O celular fica ocupado rodando código e demora pra responder ao toque. Parece que o botão não funciona.",
    en: "The phone is busy running code and responds late to taps. Buttons feel broken.",
  },
  fix: {
    pt: "Cortar e adiar scripts pesados, principalmente de plugins e ferramentas externas.",
    en: "Trim and defer heavy scripts, especially plugins and external tools.",
  },
};

/** Audit do Lighthouse -> texto. Performance só entra o que está aqui. */
export const ISSUE_COPY: Record<string, IssueCopy> = {
  // ── Velocidade ──
  "modern-image-formats": { group: "imagens", ...IMAGENS },
  "uses-optimized-images": { group: "imagens", ...IMAGENS },
  "uses-responsive-images": { group: "imagens", ...IMAGENS },
  "offscreen-images": { group: "imagens", ...IMAGENS },
  "efficient-animated-content": { group: "imagens", ...IMAGENS },
  "image-delivery-insight": { group: "imagens", ...IMAGENS },
  "uses-long-cache-ttl": { group: "cache", ...CACHE },
  "cache-insight": { group: "cache", ...CACHE },
  "render-blocking-resources": { group: "bloqueio", ...BLOQUEIO },
  "render-blocking-insight": { group: "bloqueio", ...BLOQUEIO },
  "unused-javascript": { group: "js", ...JS },
  "unminified-javascript": { group: "js", ...JS },
  "legacy-javascript": { group: "js", ...JS },
  "legacy-javascript-insight": { group: "js", ...JS },
  "unused-css-rules": { group: "js", ...JS },
  "unminified-css": { group: "js", ...JS },
  "duplicated-javascript": { group: "js", ...JS },
  "duplicated-javascript-insight": { group: "js", ...JS },
  "third-party-summary": { group: "terceiros", ...TERCEIROS },
  "third-parties-insight": { group: "terceiros", ...TERCEIROS },
  "font-display": { group: "fontes", ...FONTES },
  "font-display-insight": { group: "fontes", ...FONTES },
  "server-response-time": { group: "servidor", ...SERVIDOR },
  "document-latency-insight": { group: "servidor", ...SERVIDOR },
  redirects: {
    group: "redirecionamentos",
    cat: "performance",
    title: {
      pt: "Redirecionamentos atrasando a abertura",
      en: "Redirects delaying the first load",
    },
    why: {
      pt: "O visitante passa por um ou mais endereços antes de chegar na página certa, e cada salto custa tempo.",
      en: "Visitors bounce through one or more addresses before reaching the right page, and each hop costs time.",
    },
    fix: {
      pt: "Apontar links e anúncios direto pro endereço final.",
      en: "Point links and ads straight to the final address.",
    },
  },
  // Sintéticos (das métricas, não de um audit)
  "@cls": { group: "cls", ...CLS },
  "@tbt": { group: "trava", ...TRAVA },

  // ── Acessibilidade ──
  "label-content-name-mismatch": {
    group: "label-content-name-mismatch",
    cat: "accessibility",
    title: {
      pt: "Botões com nome diferente do texto que aparece",
      en: "Buttons named differently from their visible text",
    },
    why: {
      pt: "Quem usa leitor de tela ou comando de voz ouve um nome e vê outro, e não consegue acionar o botão.",
      en: "Screen reader and voice users hear one name and see another, so they can't trigger the button.",
    },
    fix: {
      pt: "Fazer o nome acessível de botões e links começar pelo mesmo texto que aparece na tela.",
      en: "Make the accessible name of buttons and links start with their visible text.",
    },
  },

  // ── Google ──
  "is-crawlable": {
    group: "is-crawlable",
    cat: "seo",
    impact: "alto",
    title: {
      pt: "O Google está proibido de mostrar esta página",
      en: "Google is blocked from showing this page",
    },
    why: {
      pt: "Uma configuração manda os buscadores ignorarem a página. Ela simplesmente não aparece nas buscas.",
      en: "A setting tells search engines to ignore the page. It simply doesn't show up in searches.",
    },
    fix: {
      pt: "Tirar o bloqueio (noindex ou robots.txt) das páginas que devem aparecer.",
      en: "Remove the block (noindex or robots.txt) from pages that should rank.",
    },
  },
  "http-status-code": {
    group: "http-status-code",
    cat: "seo",
    impact: "alto",
    title: {
      pt: "A página responde com erro",
      en: "The page responds with an error",
    },
    why: {
      pt: "O servidor diz que a página não existe ou deu problema, e o Google tira ela dos resultados.",
      en: "The server says the page doesn't exist or failed, so Google drops it from results.",
    },
    fix: {
      pt: "Corrigir a rota ou a configuração do servidor.",
      en: "Fix the route or the server configuration.",
    },
  },
  "document-title": {
    group: "document-title",
    cat: "seo",
    impact: "alto",
    title: { pt: "A página não tem título", en: "The page has no title" },
    why: {
      pt: "O título é o texto azul que aparece no Google. Sem ele, o Google inventa um, e quase nunca é o melhor.",
      en: "The title is the blue link shown on Google. Without one, Google makes one up, and it's rarely good.",
    },
    fix: {
      pt: "Escrever um título com o serviço e a cidade, até 60 caracteres.",
      en: "Write a title with your service and city, up to 60 characters.",
    },
  },
  "meta-description": {
    group: "meta-description",
    cat: "seo",
    impact: "medio",
    title: {
      pt: "Falta a descrição que aparece no Google",
      en: "Missing the description shown on Google",
    },
    why: {
      pt: "É o texto embaixo do título nos resultados. Sem ele, o Google pega um trecho qualquer e menos gente clica.",
      en: "It's the text under the title in results. Without it, Google grabs a random snippet and fewer people click.",
    },
    fix: {
      pt: "Escrever uma descrição convidativa de até 155 caracteres pra cada página.",
      en: "Write an inviting description of up to 155 characters for each page.",
    },
  },
  viewport: {
    group: "viewport",
    cat: "seo",
    impact: "alto",
    title: {
      pt: "O site não está adaptado pro celular",
      en: "The site isn't adapted for phones",
    },
    why: {
      pt: "A página abre miniatura no celular, e o Google rebaixa site que não funciona bem no celular.",
      en: "The page opens tiny on phones, and Google ranks non-mobile-friendly sites lower.",
    },
    fix: {
      pt: "Configurar a página pra se ajustar à largura da tela (layout responsivo).",
      en: "Make the page fit the screen width (responsive layout).",
    },
  },
  "robots-txt": {
    group: "robots-txt",
    cat: "seo",
    impact: "medio",
    title: {
      pt: "O arquivo de instruções pro Google está com erro",
      en: "The instructions file for Google is broken",
    },
    why: {
      pt: "O robots.txt diz ao Google o que ler. Com erro, ele pode ignorar páginas que deviam aparecer.",
      en: "robots.txt tells Google what to read. When it's broken, Google may skip pages that should rank.",
    },
    fix: {
      pt: "Corrigir o robots.txt e apontar nele o mapa do site (sitemap).",
      en: "Fix robots.txt and point it to the sitemap.",
    },
  },
  canonical: {
    group: "canonical",
    cat: "seo",
    impact: "medio",
    title: {
      pt: "O Google pode achar que a página é duplicada",
      en: "Google may treat the page as a duplicate",
    },
    why: {
      pt: "O endereço oficial da página está errado ou conflitante, e ela pode perder posição pra uma cópia.",
      en: "The page's official address is wrong or conflicting, so it can lose rank to a copy.",
    },
    fix: {
      pt: "Corrigir a tag canonical de cada página.",
      en: "Fix each page's canonical tag.",
    },
  },
  "link-text": {
    group: "link-text",
    cat: "seo",
    impact: "baixo",
    title: {
      pt: 'Links genéricos como "clique aqui"',
      en: 'Generic links like "click here"',
    },
    why: {
      pt: "O Google usa o texto do link pra entender o destino. \"Saiba mais\" não diz nada.",
      en: 'Google uses link text to understand where it goes. "Learn more" says nothing.',
    },
    fix: {
      pt: 'Trocar por textos que digam o destino, como "ver planos de manutenção".',
      en: 'Use text that says where it goes, like "see maintenance plans".',
    },
  },
  "crawlable-anchors": {
    group: "crawlable-anchors",
    cat: "seo",
    impact: "baixo",
    title: {
      pt: "Links que o Google não consegue seguir",
      en: "Links Google can't follow",
    },
    why: {
      pt: "Alguns links só funcionam com clique via script. O Google não segue e deixa de achar essas páginas.",
      en: "Some links only work through scripts. Google doesn't follow them and misses those pages.",
    },
    fix: {
      pt: "Usar links de verdade (com endereço) na navegação.",
      en: "Use real links (with an address) for navigation.",
    },
  },
  hreflang: {
    group: "hreflang",
    cat: "seo",
    impact: "baixo",
    title: {
      pt: "Versões de idioma mal sinalizadas",
      en: "Language versions are mislabeled",
    },
    why: {
      pt: "O Google pode mostrar a versão no idioma errado pra quem busca.",
      en: "Google may show the wrong language version to searchers.",
    },
    fix: {
      pt: "Corrigir as marcações de idioma (hreflang).",
      en: "Fix the language tags (hreflang).",
    },
  },

  // ── Acessibilidade ──
  "image-alt": {
    group: "image-alt",
    cat: "accessibility",
    impact: "medio",
    title: {
      pt: "Imagens sem descrição",
      en: "Images without a description",
    },
    why: {
      pt: "Quem usa leitor de tela não sabe o que tem na imagem, e o Google Imagens também não.",
      en: "Screen reader users can't tell what's in the image, and neither can Google Images.",
    },
    fix: {
      pt: "Escrever um texto alternativo curto pra cada imagem que importa.",
      en: "Write short alt text for every meaningful image.",
    },
  },
  "color-contrast": {
    group: "color-contrast",
    cat: "accessibility",
    impact: "medio",
    title: {
      pt: "Texto difícil de ler",
      en: "Text that's hard to read",
    },
    why: {
      pt: "Cor de texto clara demais pro fundo. No sol, no celular, a pessoa simplesmente não lê.",
      en: "Text color too light for its background. In sunlight on a phone, people just can't read it.",
    },
    fix: {
      pt: "Escurecer o texto ou clarear o fundo até atingir o contraste mínimo.",
      en: "Darken the text or lighten the background to reach minimum contrast.",
    },
  },
  "button-name": {
    group: "nomes",
    cat: "accessibility",
    impact: "medio",
    title: {
      pt: "Botões e links sem nome",
      en: "Buttons and links without a name",
    },
    why: {
      pt: "Botão só com ícone fica mudo pra leitor de tela: a pessoa não sabe o que ele faz.",
      en: "Icon-only buttons are silent to screen readers: people don't know what they do.",
    },
    fix: {
      pt: "Dar um nome (texto ou rótulo) a cada botão e link.",
      en: "Give every button and link a name (text or label).",
    },
  },
  "link-name": {
    group: "nomes",
    cat: "accessibility",
    impact: "medio",
    title: {
      pt: "Botões e links sem nome",
      en: "Buttons and links without a name",
    },
    why: {
      pt: "Botão só com ícone fica mudo pra leitor de tela: a pessoa não sabe o que ele faz.",
      en: "Icon-only buttons are silent to screen readers: people don't know what they do.",
    },
    fix: {
      pt: "Dar um nome (texto ou rótulo) a cada botão e link.",
      en: "Give every button and link a name (text or label).",
    },
  },
  label: {
    group: "label",
    cat: "accessibility",
    impact: "medio",
    title: {
      pt: "Campos de formulário sem rótulo",
      en: "Form fields without labels",
    },
    why: {
      pt: "Formulário confuso perde contato: a pessoa não sabe o que preencher em cada campo.",
      en: "Confusing forms lose leads: people don't know what goes in each field.",
    },
    fix: {
      pt: "Colocar um rótulo visível em cada campo.",
      en: "Add a visible label to every field.",
    },
  },
  "target-size": {
    group: "target-size",
    cat: "accessibility",
    impact: "medio",
    title: {
      pt: "Botões pequenos demais pro dedo",
      en: "Buttons too small for fingers",
    },
    why: {
      pt: "No celular a pessoa erra o toque, abre a coisa errada e desiste.",
      en: "On phones people miss the tap, open the wrong thing and give up.",
    },
    fix: {
      pt: "Aumentar a área de toque pra pelo menos 44px e afastar botões vizinhos.",
      en: "Make tap targets at least 44px and space neighbors apart.",
    },
  },
  "meta-viewport": {
    group: "meta-viewport",
    cat: "accessibility",
    impact: "medio",
    title: {
      pt: "O zoom está bloqueado no celular",
      en: "Zoom is blocked on phones",
    },
    why: {
      pt: "Quem tem dificuldade pra ler não consegue ampliar o texto.",
      en: "People who struggle to read can't enlarge the text.",
    },
    fix: {
      pt: "Liberar o zoom na configuração da página.",
      en: "Allow zoom in the page settings.",
    },
  },
  "html-has-lang": {
    group: "html-has-lang",
    cat: "accessibility",
    impact: "baixo",
    title: {
      pt: "O idioma da página não está declarado",
      en: "The page language isn't declared",
    },
    why: {
      pt: "Leitor de tela e tradutor automático leem o texto com a pronúncia errada.",
      en: "Screen readers and translators read the text with the wrong pronunciation.",
    },
    fix: {
      pt: "Declarar o idioma (pt-BR) na página.",
      en: "Declare the page language.",
    },
  },
  "heading-order": {
    group: "heading-order",
    cat: "accessibility",
    impact: "baixo",
    title: {
      pt: "Títulos fora de ordem",
      en: "Headings out of order",
    },
    why: {
      pt: "A estrutura de títulos é o sumário da página pra leitores de tela e pro Google.",
      en: "Heading structure is the page outline for screen readers and Google.",
    },
    fix: {
      pt: "Organizar os títulos em sequência (H1, H2, H3...).",
      en: "Order headings in sequence (H1, H2, H3...).",
    },
  },

  // ── Segurança e boas práticas ──
  "is-on-https": {
    group: "is-on-https",
    cat: "bestPractices",
    impact: "alto",
    title: {
      pt: 'O navegador mostra o site como "não seguro"',
      en: 'Browsers flag the site as "not secure"',
    },
    why: {
      pt: "Visitante vê o aviso e desconfia, principalmente na hora de mandar contato ou pagar.",
      en: "Visitors see the warning and lose trust, especially when sending a contact or paying.",
    },
    fix: {
      pt: "Ativar HTTPS (certificado SSL, quase sempre grátis) em todo o site.",
      en: "Enable HTTPS (an SSL certificate, usually free) across the site.",
    },
  },
  "redirects-http": {
    group: "redirects-http",
    cat: "bestPractices",
    impact: "medio",
    title: {
      pt: "A versão sem cadeado continua aberta",
      en: "The non-secure version is still open",
    },
    why: {
      pt: "Quem digita o endereço sem https cai numa versão insegura do site.",
      en: "People typing the address without https land on an insecure version.",
    },
    fix: {
      pt: "Redirecionar todo acesso http pra https.",
      en: "Redirect all http traffic to https.",
    },
  },
  "errors-in-console": {
    group: "errors-in-console",
    cat: "bestPractices",
    impact: "baixo",
    title: {
      pt: "Erros acontecendo por trás da página",
      en: "Errors happening behind the page",
    },
    why: {
      pt: "Algo quebra enquanto a página carrega. Pode ser um formulário, um pixel ou um botão que não funciona.",
      en: "Something breaks while the page loads. It may be a form, a pixel or a button that doesn't work.",
    },
    fix: {
      pt: "Investigar e corrigir os erros de script.",
      en: "Track down and fix the script errors.",
    },
  },
  "image-aspect-ratio": {
    group: "image-aspect-ratio",
    cat: "bestPractices",
    impact: "baixo",
    title: { pt: "Imagens distorcidas", en: "Distorted images" },
    why: {
      pt: "Foto esticada ou achatada passa descuido e derruba a confiança na marca.",
      en: "Stretched or squashed photos look careless and hurt brand trust.",
    },
    fix: {
      pt: "Exibir cada imagem na proporção original.",
      en: "Display each image at its original proportions.",
    },
  },
  "image-size-responsive": {
    group: "image-size-responsive",
    cat: "bestPractices",
    impact: "baixo",
    title: { pt: "Imagens borradas no celular", en: "Blurry images on phones" },
    why: {
      pt: "Imagem menor que o necessário fica sem nitidez em tela de boa resolução.",
      en: "Images smaller than needed look soft on high-resolution screens.",
    },
    fix: {
      pt: "Entregar versões em alta resolução pra telas que pedem.",
      en: "Serve high-resolution versions to screens that need them.",
    },
  },
};

/** Quando o achado não está no dicionário: texto da categoria. */
/**
 * Reserva pra achado sem texto próprio. O `title` só é usado quando o título
 * do Lighthouse chega em inglês num relatório em português (alguns audits
 * novos não têm tradução no Lighthouse).
 */
export const CATEGORY_FALLBACK: Record<Category, { title: L10n; why: L10n; fix: L10n }> = {
  performance: {
    title: { pt: "Detalhe técnico deixando a página mais lenta", en: "Technical detail slowing the page down" },
    why: {
      pt: "Deixa o site mais lento no celular, e site lento perde visita antes de carregar.",
      en: "Makes the site slower on phones, and slow sites lose visitors before they load.",
    },
    fix: {
      pt: "Ajuste técnico no carregamento da página.",
      en: "A technical fix in how the page loads.",
    },
  },
  seo: {
    title: { pt: "Detalhe técnico atrapalhando o Google", en: "Technical detail hurting Google" },
    why: {
      pt: "Atrapalha o Google a entender e mostrar o seu site nas buscas.",
      en: "Makes it harder for Google to understand and show your site.",
    },
    fix: {
      pt: "Ajuste nas marcações que o Google lê.",
      en: "A fix in the markup Google reads.",
    },
  },
  accessibility: {
    title: { pt: "Partes do site difíceis de usar com leitor de tela", en: "Parts of the site hard to use with a screen reader" },
    why: {
      pt: "Dificulta o uso por parte de visitantes, inclusive quem tem pouca visão ou usa leitor de tela.",
      en: "Makes the site harder to use, including for people with low vision or screen readers.",
    },
    fix: {
      pt: "Ajuste no código da interface.",
      en: "A fix in the interface code.",
    },
  },
  bestPractices: {
    title: { pt: "Configuração técnica fora do recomendado", en: "Technical setting outside best practice" },
    why: {
      pt: "Pode passar insegurança ou dar erro em alguns navegadores.",
      en: "Can look untrustworthy or break in some browsers.",
    },
    fix: {
      pt: "Ajuste técnico de segurança ou compatibilidade.",
      en: "A security or compatibility fix.",
    },
  },
};

/** Audits que nunca viram item (métrica crua, diagnóstico sem ação, duplicados). */
export const IGNORED = new Set([
  "first-contentful-paint",
  "largest-contentful-paint",
  "speed-index",
  "total-blocking-time",
  "cumulative-layout-shift",
  "interactive",
  "max-potential-fid",
  "image-redundant-alt",
  "structured-data",
]);
