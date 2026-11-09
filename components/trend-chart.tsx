"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { formatInteger } from "@/lib/formatters";
import type { Provenance, TrendPoint } from "@/lib/types";
import { Panel } from "@/components/panel";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function TrendChart({
  points,
  provenance,
}: {
  points: TrendPoint[];
  provenance: Provenance;
}) {
  const [showTable, setShowTable] = useState(false);
  const hasData = points.some((point) => point.value !== null);
  if (!hasData)
    return <p className="empty-state">Belum ada data untuk periode ini.</p>;
  const option = {
    animation: false,
    grid: { left: 42, right: 8, top: 20, bottom: 28 },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) => formatInteger(value),
    },
    legend: { top: 0, right: 0, textStyle: { color: "#617184", fontSize: 10 } },
    xAxis: {
      type: "category",
      data: points.map((point) => point.label),
      axisLine: { lineStyle: { color: "#dce5e4" } },
      axisLabel: { color: "#7b8995", fontSize: 10 },
    },
    yAxis: {
      type: "value",
      splitNumber: 3,
      axisLabel: {
        color: "#7b8995",
        fontSize: 10,
        formatter: (value: number) => `${Math.round(value / 1000)}K`,
      },
      splitLine: { lineStyle: { color: "#edf1f1", type: "dashed" } },
    },
    series: [
      {
        name: "2026 demo",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        data: points.map((point) => point.value),
        lineStyle: { color: "#168c8d", width: 3 },
        itemStyle: { color: "#168c8d" },
        areaStyle: { color: "rgba(22,140,141,.12)" },
      },
      {
        name: "Perbandingan demo",
        type: "line",
        smooth: true,
        symbol: "none",
        data: points.map((point) => point.comparisonValue),
        lineStyle: { color: "#a7b9c2", type: "dashed", width: 2 },
        itemStyle: { color: "#a7b9c2" },
      },
    ],
  };
  return (
    <div className="chart-wrap">
      <p className="chart-summary">Seri bulanan · {provenance.sourceLabel}</p>
      <ReactECharts
        option={option}
        style={{ height: 205 }}
        opts={{ renderer: "svg" }}
      />
      <button
        className="table-toggle"
        type="button"
        onClick={() => setShowTable(!showTable)}
        aria-expanded={showTable}
      >
        {showTable ? "Sembunyikan tabel" : "Lihat data sebagai tabel"}
      </button>
      {showTable && (
        <table className="accessible-table">
          <caption className="sr-only">Data tren kunjungan demonstrasi</caption>
          <thead>
            <tr>
              <th>Periode</th>
              <th>2026</th>
              <th>Perbandingan</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.label}>
                <td>{point.label}</td>
                <td>{formatInteger(point.value)}</td>
                <td>{formatInteger(point.comparisonValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function TrendPanel({
  points,
  provenance,
}: {
  points: TrendPoint[];
  provenance: Provenance;
}) {
  return (
    <Panel title="Tren kunjungan wisatawan">
      <TrendChart points={points} provenance={provenance} />
    </Panel>
  );
}
