"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";

export function AppShell({
  children,
  activeNav,
}: {
  children: React.ReactNode;
  activeNav: string;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return (
    <div className="dashboard-frame">
      <Sidebar
        activeNav={activeNav}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      />
      <main className="main-content">
        <div className="content-width" id="overview">
          {children}
        </div>
      </main>
    </div>
  );
}
