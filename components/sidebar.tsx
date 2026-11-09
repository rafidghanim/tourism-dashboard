"use client";

import {
  BarChart3,
  ChevronRight,
  FileText,
  LayoutDashboard,
  MapPin,
  Menu,
  Mountain,
  Settings,
  X,
} from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

const nav = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Sebaran kunjungan", href: "/sebaran-kunjungan", icon: MapPin },
  { label: "Analisis destinasi", href: "/analisis-destinasi", icon: Mountain },
  { label: "Tren wisata", href: "/tren-wisata", icon: BarChart3 },
];

export function Sidebar({
  activeNav,
  open,
  onClose,
  onOpen,
}: {
  activeNav: string;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}) {
  return (
    <>
      <button
        className="mobile-menu"
        aria-label="Buka menu navigasi"
        onClick={onOpen}
      >
        <Menu size={20} />
      </button>
      {open && (
        <button
          className="sidebar-backdrop"
          aria-label="Tutup menu navigasi"
          onClick={onClose}
        />
      )}
      <aside
        className={`sidebar ${open ? "open" : ""}`}
        aria-label="Navigasi utama"
      >
        <div className="sidebar-brand">
          <svg className="brand-mark" viewBox="0 0 100 48" aria-hidden="true">
            <path
              fill="currentColor"
              opacity=".36"
              d="M4 38 31 11l14 14L62 6l34 32H4Z"
            />
            <path
              fill="currentColor"
              opacity=".72"
              d="m5 38 18-15 15 7 23-15 34 23H5Z"
            />
            <path
              fill="currentColor"
              d="m4 38 27-27 11 11-10 8-10-4-10 12H4Z"
            />
          </svg>
          <h1 className="brand-title">
            Tourism
            <br />
            Intelligence
          </h1>
          <p className="brand-subtitle">Kudus Regency</p>
        </div>
        <nav className="nav-group" aria-label="Navigasi utama">
          {nav.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className={`nav-link ${activeNav === label ? "active" : ""}`}
              onClick={onClose}
            >
              <Icon />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="nav-group">
          <div className="nav-label">Perencanaan</div>
          <a
            className={`nav-link ${activeNav === "Simulasi kebijakan" ? "active" : ""}`}
            href="/simulasi-kebijakan"
            onClick={onClose}
          >
            <FileText />
            <span>Simulasi kebijakan</span>
          </a>
          <a
            className={`nav-link ${activeNav === "Rekomendasi kebijakan" ? "active" : ""}`}
            href="/rekomendasi-kebijakan"
            onClick={onClose}
          >
            <MapPin />
            <span>Rekomendasi kebijakan</span>
          </a>
        </div>
        <div className="nav-group">
          <div className="nav-label">Dokumentasi</div>
          <a
            className={`nav-link ${activeNav === "Laporan" ? "active" : ""}`}
            href="/laporan"
            onClick={onClose}
          >
            <FileText />
            <span>Laporan</span>
          </a>
        </div>
        {/* <div className="nav-group"><div className="nav-label">Administrasi</div><a className={`nav-link ${activeNav === "Admin" ? "active" : ""}`} href="/admin" onClick={onClose}><Settings /><span>Data management</span></a></div> */}
        <div className="updated-card">
          <div className="updated-label">Data terakhir diperbarui</div>
          <div className="updated-time">
            <span className="updated-dot" />8 Nov 2026, 14:32 WIB{" "}
            <ChevronRight size={13} />
          </div>
        </div>
        <IconButton
          className="sidebar-close"
          aria-label="Tutup menu navigasi"
          onClick={onClose}
        >
          <X size={18} />
        </IconButton>
      </aside>
    </>
  );
}
