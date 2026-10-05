"use client";

import Link from "next/link";
import AvatarMenu from "./deck/AvatarMenu";
import ContactFab from "./ContactFab";
import SearchHint from "./SearchHint";
import FontSizeButton from "./a11y/FontSizeButton";
import { CursorFollower } from "./motion/CursorFollower";
import { PageTransition } from "./motion/PageTransition";

/**
 * Moldura das páginas internas (/about, /cv, /certificates...). Sem rail: o
 * nome no topo volta pra home e o avatar no canto inferior esquerdo é o menu,
 * igual na home.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CursorFollower />
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-surface from-50% to-transparent">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/"
            className="pointer-events-auto text-base font-extrabold tracking-[-0.03em] transition-opacity hover:opacity-70"
          >
            Vitor de Souza
          </Link>
          <div className="pointer-events-auto flex items-center gap-2">
            <FontSizeButton />
            <SearchHint />
          </div>
        </div>
      </header>
      <div className="pt-16">
        <PageTransition>{children}</PageTransition>
      </div>
      <div className="fixed bottom-6 left-4 z-[80] sm:left-8">
        <AvatarMenu className="bg-surface elev-2" />
      </div>
      <ContactFab />
    </>
  );
}
