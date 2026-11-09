"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { DestinationRanking } from "@/components/destination-ranking";
import { DestinationStatus } from "@/components/destination-status";
import { DistributionChart } from "@/components/distribution-chart";
import { FilterBar } from "@/components/filter-bar";
import { InsightCard } from "@/components/insight-card";
import { KpiCard } from "@/components/kpi-card";
import { MapPanel } from "@/components/map-panel";
import { Panel } from "@/components/panel";
import { ProvenanceBanner } from "@/components/provenance-banner";
import { TrendChart } from "@/components/trend-chart";
import { getDemoDashboard } from "@/lib/demo-data";
import { getApiDashboard, isApiConfigured } from "@/lib/api-client";
import type { DashboardFilters } from "@/lib/types";

const initialFilters: DashboardFilters = { regionId: "kudus", period: "2026-ytd", visitorCategory: "all" };

export default function HomePage() {
  const [filters, setFilters] = useState(initialFilters);
  const demoDashboard = useMemo(() => getDemoDashboard(filters), [filters]);
  const [dashboard, setDashboard] = useState(demoDashboard);
  const [apiError, setApiError] = useState<string | null>(null);
  useEffect(() => {
    if (!isApiConfigured()) { setDashboard(demoDashboard); return; }
    let active = true;
    getApiDashboard(filters).then((value) => { if (active) { setDashboard(value); setApiError(null); } }).catch((error: Error) => { if (active) { setDashboard(demoDashboard); setApiError(error.message); } });
    return () => { active = false; };
  }, [filters, demoDashboard]);

  return (
    <AppShell activeNav="Dashboard">
      <DashboardHeader />
      <ProvenanceBanner provenance={dashboard.provenance} />
      {apiError && <p className="api-fallback-note" role="status">API tidak tersedia; menampilkan data demonstrasi lokal.</p>}
      <FilterBar value={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />

      <div className="kpi-grid" aria-label="Ringkasan indikator wisata">
        {dashboard.kpis.items.map((metric) => <KpiCard key={metric.id} metric={metric} />)}
      </div>

      <div className="primary-grid">
        <Panel title="Peta sebaran kunjungan" icon="map" action="Tahun berjalan">
          <MapPanel points={dashboard.mapPoints} provenance={dashboard.provenance} />
        </Panel>
        <Panel title="Tren kunjungan wisatawan" icon="trend" action="Bulanan">
          <TrendChart points={dashboard.trend} provenance={dashboard.provenance} />
        </Panel>
        <InsightCard insight={dashboard.insight} provenance={dashboard.provenance} />
      </div>

      <div className="supporting-grid">
        <Panel title="Peringkat destinasi" icon="rank" action="Lihat semua">
          <DestinationRanking destinations={dashboard.destinations} />
        </Panel>
        <Panel title="Distribusi wisatawan" icon="distribution">
          <DistributionChart items={dashboard.distribution} provenance={dashboard.provenance} />
        </Panel>
        <Panel title="Status destinasi" icon="status" action="Semua wilayah">
          <DestinationStatus items={dashboard.statuses} />
        </Panel>
      </div>
    </AppShell>
  );
}
