import type { ReactNode } from "react";

export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <span className="group relative inline-flex">
      <span className="sr-only">{label}</span>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--ink-primary)] px-2 py-1 text-[10px] font-semibold text-white shadow-md group-hover:block group-focus-within:block"
      >
        {label}
      </span>
    </span>
  );
}
