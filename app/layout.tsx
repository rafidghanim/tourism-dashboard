import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tourism Intelligence — Kudus Regency",
  description: "Regional tourism intelligence dashboard for Kabupaten Kudus.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
