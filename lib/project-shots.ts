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
 * - egp-iot: telas "Módulos" e "Eventos" do app EGP PLUG IN, tiradas da
 *   ficha da Play Store (07/out/2026). Só celular: o app não tem versão de
 *   computador, então o mockup mostra dois aparelhos.
 */
export type ProjectShots = {
  desktop?: string;
  mobile?: string;
  /** object-position do print de celular (padrão: topo). */
  mobileFocus?: string;
  /** Segunda tela de celular, pra app sem versão de computador (dois aparelhos). */
  mobileAlt?: string;
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
  "egp-iot": { mobile: "/projects/shots/egp-iot-mobile.jpg", mobileAlt: "/projects/shots/egp-iot-mobile-2.jpg" },
};

/** Sites que estavam fora do ar nos prints: o card não manda ninguém pra lá. */
export const OFFLINE_PROJECTS = new Set(["norte-premium", "oncoliving"]);
