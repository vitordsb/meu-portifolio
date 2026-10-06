"use client";

import { Briefcase, House, Layers, Route } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DECK_SECTIONS } from "@/lib/deck-content";
import SideRail from "@/components/nav/SideRail";

const ICONS = [House, Briefcase, Layers, Route];

/** Menu lateral do deck: as 4 sessões, trocadas pelo índice. */
export default function DeckSideNav({
  current,
  labels,
  onChange,
}: {
  current: number;
  labels: string[];
  onChange: (index: number) => void;
}) {
  const { language } = useLanguage();
  const items = DECK_SECTIONS.map((s, i) => ({
    id: s.id,
    label: labels[i],
    icon: ICONS[i] ?? House,
  }));
  return (
    <SideRail
      items={items}
      current={DECK_SECTIONS[current]?.id ?? "inicio"}
      onSelect={(id) => onChange(DECK_SECTIONS.findIndex((s) => s.id === id))}
      groupTitle={language === "pt" ? "Portfólio" : "Portfolio"}
    />
  );
}
