"use client";

import TopBar from "@/components/home/TopBar";

/**
 * Topo das páginas internas (/servicos, /pagar, /quanto-custa, /raio-x,
 * jurídicas): a mesma barra da home, na mesma largura, pra o site inteiro ter
 * um topo só (marca, sessões, busca, tema e idioma com texto).
 */
export default function PageHeader() {
  return <TopBar />;
}
