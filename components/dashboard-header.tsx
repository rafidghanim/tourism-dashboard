import { Bell, Download, Search } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

export function DashboardHeader() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <div className="eyebrow">
            Regional Intelligence <span>/</span> 01
          </div>
          <h1 className="page-title">Tourism Overview</h1>
          <p className="page-subtitle">
            Understanding the regional tourism landscape.
          </p>
        </div>
      </div>
      <div className="top-actions">
        <button
          className="search-control"
          type="button"
          aria-label="Cari destinasi, laporan, atau analisis"
        >
          <Search size={16} />
          Cari destinasi, laporan, atau analisis...
          <span className="key-hint">⌘ K</span>
        </button>
        <IconButton aria-label="Notifikasi">
          <Bell size={17} />
        </IconButton>
        <span className="avatar" aria-label="Profil pengguna demo">
          RG
        </span>
        <button className="export-button" type="button">
          <Download size={15} />
          Ekspor laporan
        </button>
      </div>
    </header>
  );
}
