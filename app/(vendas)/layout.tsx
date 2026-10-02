import { PageTransition } from "@/components/motion/PageTransition";

/**
 * Páginas de venda (/orcamento, /servicos, /pagar, /pagamento/obrigado): sem a
 * moldura das páginas internas (cada uma tem o próprio topo), mas com a mesma
 * entrada suave a cada navegação. O grupo "(vendas)" não entra na URL.
 */
export default function VendasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
