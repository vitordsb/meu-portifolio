/** O que aparece no card do site (vai pro navegador). */
export type PublicTestimonial = {
  id: string;
  /** Id do projeto (lib/testimonials/projects): liga o depoimento ao case. */
  project: string;
  name: string;
  role: string | null;
  projectName: string | null;
  photoUrl: string | null;
  quote: string;
  /** 1 a 5. */
  rating: number;
  /** Veio pelo link único que o Vitor mandou: é cliente de verdade. */
  verified: boolean;
};

export type TestimonialStatus = "publicado" | "removido";

/** O registro inteiro, guardado no Blob (`depoimentos/dados/<id>.json`). */
export type StoredTestimonial = PublicTestimonial & {
  status: TestimonialStatus;
  /** Versão do texto de autorização que a pessoa marcou. */
  consentVersion: string;
  createdAt: string;
  removedAt?: string;
};

/** Versão do texto de autorização (muda junto com o texto do formulário). */
export const CONSENT_VERSION = "2026-10-21";

export const LIMITS = {
  name: [3, 80],
  role: [0, 80],
  quote: [20, 600],
  /** Foto já reduzida no navegador; acima disso nem chega no servidor. */
  photoBytes: 4 * 1024 * 1024,
} as const;
