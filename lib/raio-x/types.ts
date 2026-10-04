/** Formato do Raio-X que vai do servidor pra página (já no idioma da pessoa). */

export const CATEGORIES = [
  "performance",
  "seo",
  "accessibility",
  "bestPractices",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type Impact = "alto" | "medio" | "baixo";

export type Issue = {
  id: string;
  cat: Category;
  impact: Impact;
  title: string;
  /** Por que isso custa cliente, na língua de quem é dono do site. */
  why: string;
  /** O que precisa ser feito, sem jargão. */
  fix: string;
};

export type Report = {
  /** Endereço que o Google abriu (depois de redirecionamentos). */
  url: string;
  scores: Record<Category, number>;
  metrics: {
    /** Quando o conteúdo principal aparece no celular. */
    lcpMs: number;
    fcpMs: number;
    cls: number;
    tbtMs: number;
  };
  /** Foto do site no celular (data:image/jpeg) ou null. */
  screenshot: string | null;
  issues: Issue[];
  analyzedAt: string;
};
