"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FontSizeButton from "@/components/a11y/FontSizeButton";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Topo das páginas de compra (/servicos, /pagar, /pagamento/obrigado): só o
 * voltar pra home e o botão de tamanho da letra. Mesmo desenho do /orcamento.
 */
export default function PageHeader({
  width = "max-w-5xl",
}: {
  /** Mesma largura do conteúdo, pra o topo alinhar com ele. */
  width?: string;
}) {
  const { language } = useLanguage();
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
          {language === "pt" ? "Início" : "Home"}
        </Link>
        <FontSizeButton />
      </div>
    </header>
  );
}
