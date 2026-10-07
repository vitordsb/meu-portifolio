/**
 * Prints de cada projeto pros mockups de argila (components/home/ClayMockup).
 *
 * Os de public/projects/shots foram tirados do site no ar em 06/out/2026
 * (desktop 1440x900 e celular 390x844, aviso de cookies escondido só no
 * print). Os que ficaram com o print antigo:
 * - zuptos e mtcprop-members: o sistema fica atrás de login, então vale o
 *   print do painel que o Vitor tinha; falta a versão de celular.
 * - norte-premium e oncoliving: os sites estavam fora do ar (hospedagem
 *   suspensa e erro de certificado) no dia dos prints.
 * - arqdoor-mobile: arte de divulgação do app; o mockup mostra o recorte da
 *   tela que aparece nela (`mobileFocus`).
 */
export type ProjectShots = {
  desktop?: string;
  mobile?: string;
  /** object-position do print de celular (padrão: topo). */
  mobileFocus?: string;
};

const fresh = (slug: string): ProjectShots => ({
  desktop: `/projects/shots/${slug}-desktop.jpg`,
  mobile: `/projects/shots/${slug}-mobile.jpg`,
});

export const PROJECT_SHOTS: Record<string, ProjectShots> = {
  arqdoor: fresh("arqdoor"),
  "mtcprop-site": fresh("mtcprop-site"),
  "egp-industria": fresh("egp-industria"),
  florenza: fresh("florenza"),
  "negritude-junior": fresh("negritude-junior"),
  zynta: fresh("zynta"),
  bioathos: fresh("bioathos"),
  girob2b: fresh("girob2b"),
  zuptos: { desktop: "/projects/zuptos.png" },
  "mtcprop-members": { desktop: "/projects/mtcprop-members.png" },
  "norte-premium": { desktop: "/projects/norte-premium.png" },
  oncoliving: { desktop: "/projects/oncoliving.png" },
  "arqdoor-mobile": { mobile: "/projects/arqdoor-app.jpg", mobileFocus: "78% 88%" },
};

/** Sites que estavam fora do ar nos prints: o card não manda ninguém pra lá. */
export const OFFLINE_PROJECTS = new Set(["norte-premium", "oncoliving"]);
