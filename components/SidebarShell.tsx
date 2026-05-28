"use client";

import { useCallback, useEffect, useState } from "react";
import Navbar from "./Navbar";
import ContactFab from "./ContactFab";
import { CursorFollower } from "./motion/CursorFollower";
import { PageTransition } from "./motion/PageTransition";

const STORAGE_KEY = "sidebar-collapsed";

export default function SidebarShell({ children }: { children: React.ReactNode }) {
  // Padrão = encolhida. Só expande se o usuário salvou essa preferência.
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "0") setCollapsed(false);
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  return (
    <>
      <CursorFollower />
      <Navbar collapsed={collapsed} onToggle={toggle} />
      <div className={collapsed ? "lg:pl-16 transition-[padding] duration-200" : "lg:pl-60 transition-[padding] duration-200"}>
        <PageTransition>{children}</PageTransition>
      </div>
      <ContactFab />
    </>
  );
}
