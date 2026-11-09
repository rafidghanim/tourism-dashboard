"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[2000] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Detail destinasi"
    >
      <button
        className="absolute inset-0 bg-[rgba(16,35,56,.35)]"
        aria-label="Tutup detail destinasi"
        onClick={() => onOpenChange(false)}
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[78vh] overflow-y-auto rounded-t-2xl border-t border-[var(--line)] bg-white p-4 shadow-2xl">
        <button
          type="button"
          className="absolute right-4 top-4 inline-grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-secondary)]"
          aria-label="Tutup detail destinasi"
          onClick={() => onOpenChange(false)}
        >
          <X size={15} />
        </button>
        {children}
      </div>
    </div>
  );
}
