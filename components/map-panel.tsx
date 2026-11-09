"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { Layers3, LocateFixed, Minus, Plus } from "lucide-react";
import { formatInteger } from "@/lib/formatters";
import type { MapDestinationPoint, Provenance } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover } from "@/components/ui/popover";
import { Sheet } from "@/components/ui/sheet";
import { Tooltip } from "@/components/ui/tooltip";
import type { MapCanvasHandle } from "@/components/map-canvas";

const MapCanvas = dynamic(() => import("@/components/map-canvas").then((module) => module.MapCanvas), { ssr: false });

function DestinationDetails({ point }: { point: MapDestinationPoint }) {
  return <><CardHeader className="pr-10"><p className="mb-1 font-data text-[9px] uppercase tracking-[.14em] text-[var(--accent-teal-dark)]">Destinasi terpilih</p><CardTitle>{point.name}</CardTitle></CardHeader><CardContent><div className="flex items-end justify-between gap-3"><div><p className="text-[11px] text-[var(--ink-secondary)]">Kunjungan demonstrasi</p><p className="mt-1 font-data text-lg font-bold tracking-[-.06em]">{formatInteger(point.visits)}</p></div><span className="rounded-full bg-[var(--accent-teal-soft)] px-2 py-1 text-[9px] font-bold text-[var(--accent-teal-dark)]">{point.intensity === "high" ? "Tinggi" : point.intensity === "medium" ? "Sedang" : "Rendah"}</span></div><p className="mt-3 text-[10px] leading-relaxed text-[var(--ink-secondary)]">Lokasi digeneralisasi untuk tampilan publik. Detail ini menggunakan data demonstrasi.</p></CardContent></>;
}

export function MapPanel({ points, provenance }: { points: MapDestinationPoint[]; provenance: Provenance }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [satellite, setSatellite] = useState(false);
  const mapRef = useRef<MapCanvasHandle>(null);
  const selected = useMemo(() => points.find((point) => point.id === selectedId) ?? null, [points, selectedId]);
  return (
    <div className="map-panel-wrap">
      <div className="map-shell" data-testid="interactive-map">
        <div className="map-canvas">
          <MapCanvas ref={mapRef} points={points} selectedId={selectedId} onSelect={setSelectedId} onClear={() => setSelectedId(null)} satellite={satellite} />
          <div className="map-control-stack" aria-label="Kontrol peta">
            <Tooltip label="Perbesar"><Button variant="map" size="icon" aria-label="Perbesar peta" onClick={() => mapRef.current?.zoomIn()}><Plus size={16} /></Button></Tooltip>
            <Tooltip label="Perkecil"><Button variant="map" size="icon" aria-label="Perkecil peta" onClick={() => mapRef.current?.zoomOut()}><Minus size={16} /></Button></Tooltip>
            <Tooltip label="Atur ulang tampilan"><Button variant="map" size="icon" aria-label="Atur ulang tampilan peta" onClick={() => mapRef.current?.reset()}><LocateFixed size={15} /></Button></Tooltip>
            <Tooltip label={satellite ? "Peta standar" : "Lapisan peta"}><Button variant="map" size="icon" aria-label={satellite ? "Gunakan peta standar" : "Tampilkan lapisan peta"} aria-pressed={satellite} onClick={() => setSatellite((value) => !value)}><Layers3 size={15} /></Button></Tooltip>
          </div>
          <Popover open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
            {selected && <Card className="hidden md:block"><DestinationDetails point={selected} /></Card>}
          </Popover>
          <div className="map-attribution-note">{provenance.sourceLabel}</div>
          <div className="map-legend-card"><span>Rendah</span><span className="legend-bar" /><span>Tinggi</span></div>
        </div>
      </div>
      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>{selected && <DestinationDetails point={selected} />}</Sheet>
      <p className="sr-only">Peta interaktif menggunakan koordinat umum. Pilih marker untuk membuka detail destinasi.</p>
      <div className="map-list" aria-label={`Daftar destinasi ${provenance.sourceLabel}`}>
        {points.map((point) => <button className={`map-list-item ${selectedId === point.id ? "selected" : ""}`} key={point.id} type="button" onClick={() => setSelectedId(point.id)}><span>{point.name}</span><strong className="font-data">{formatInteger(point.visits)}</strong></button>)}
      </div>
    </div>
  );
}
