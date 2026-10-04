import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Topo das páginas de compra (/servicos, /pagar, /pagamento/obrigado): só o
 * voltar pra home. Mesmo desenho do /orcamento.
 */
export default function PageHeader({
  width = "max-w-5xl",
}: {
  /** Mesma largura do conteúdo, pra o topo alinhar com ele. */
  width?: string;
}) {
  return (
    <header className="border-b border-outline-variant">
      <div
        className={`mx-auto flex h-14 w-full ${width} items-center justify-between gap-4 px-4`}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-[-0.01em] transition-opacity hover:opacity-70"
        >
          <ArrowLeft size={16} />
          Vitor de Souza
        </Link>
      </div>
    </header>
  );
}
