"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export function Popover({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onOpenChange(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open, onOpenChange]);
  return (
    <div
      ref={ref}
      className="absolute right-3 top-3 z-[1000] w-[min(280px,calc(100%-1.5rem))]"
    >
      {open ? children : null}
    </div>
  );
}
