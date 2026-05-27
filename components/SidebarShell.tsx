"use client";

import { useCallback, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { CursorFollower } from "./motion/CursorFollower";

const STORAGE_KEY = "sidebar-collapsed";

export default function SidebarShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "1") setCollapsed(true);
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
        {children}
      </div>
    </>
  );
}
