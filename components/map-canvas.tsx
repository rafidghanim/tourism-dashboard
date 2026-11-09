"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import type { MapDestinationPoint } from "@/lib/types";

function MapBridge({
  onReady,
  onClick,
}: {
  onReady: (map: LeafletMap) => void;
  onClick: () => void;
}) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  useMapEvents({ click: onClick });
  return null;
}

export interface MapCanvasHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  toggleSatellite: () => void;
}

export const MapCanvas = forwardRef<
  MapCanvasHandle,
  {
    points: MapDestinationPoint[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onClear: () => void;
    satellite: boolean;
  }
>(({ points, selectedId, onSelect, onClear, satellite }, ref) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const center: [number, number] = [-6.76, 110.87];
  const bounds: [[number, number], [number, number]] = [
    [-6.94, 110.76],
    [-6.59, 111.02],
  ];
  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => mapRef.current?.zoomIn(),
      zoomOut: () => mapRef.current?.zoomOut(),
      reset: () => mapRef.current?.fitBounds(bounds, { padding: [20, 20] }),
      toggleSatellite: () => undefined,
    }),
    [],
  );
  return (
    <MapContainer
      center={center}
      zoom={11}
      minZoom={9}
      maxZoom={16}
      scrollWheelZoom
      className="h-full w-full"
      aria-label="Peta interaktif sebaran kunjungan Kabupaten Kudus"
    >
      <TileLayer
        key={satellite ? "topographic" : "standard"}
        attribution={
          satellite
            ? "&copy; OpenTopoMap contributors"
            : "&copy; OpenStreetMap contributors"
        }
        url={
          satellite
            ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      />
      <MapBridge
        onReady={(map) => {
          mapRef.current = map;
        }}
        onClick={onClear}
      />
      {points.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.latitude, point.longitude]}
          radius={selectedId === point.id ? 10 : 7}
          pathOptions={{
            color: "#ffffff",
            weight: 3,
            fillColor:
              point.intensity === "high"
                ? "#0e6e73"
                : point.intensity === "medium"
                  ? "#168c8d"
                  : "#6aa9a3",
            fillOpacity: 0.95,
          }}
          eventHandlers={{
            click: (event) => {
              event.originalEvent.stopPropagation();
              onSelect(point.id);
            },
          }}
        >
          <span>{point.name}</span>
        </CircleMarker>
      ))}
    </MapContainer>
  );
});
MapCanvas.displayName = "MapCanvas";
