"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { formatInteger, formatPercent } from "@/lib/formatters";
import type { Provenance, VisitorDistributionItem } from "@/lib/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function DistributionChart({
  items,
  provenance,
}: {
  items: VisitorDistributionItem[];
  provenance: Provenance;
}) {
  const [showTable, setShowTable] = useState(false);
  const total = items.reduce((sum, item) => sum + (item.count ?? 0), 0);
  if (!total) return <p className="empty-state">Belum ada data distribusi.</p>;
  const option = {
    animation: false,
    tooltip: { trigger: "item", formatter: "{b}: {d}%" },
    series: [
      {
        type: "pie",
        radius: ["52%", "76%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: "center",
          formatter: `{value|${formatPercent(items[0]?.percentage ?? null)}}\n{label|Domestik}`,
          rich: {
            value: {
              fontSize: 20,
              fontWeight: 700,
              color: "#102338",
              fontFamily: "IBM Plex Mono",
            },
            label: { fontSize: 10, color: "#617184", lineHeight: 20 },
          },
        },
        data: items.map((item) => ({
          value: item.count,
          name: item.label,
          itemStyle: { color: item.color === "dark" ? "#102338" : "#c4d6d8" },
        })),
      },
    ],
  };
  return (
    <div className="distribution-layout">
      <div className="distribution-chart-wrap">
        <ReactECharts
          option={option}
          style={{ height: 190 }}
          opts={{ renderer: "svg" }}
        />
      </div>
      <div className="distribution-list">
        {items.map((item) => (
          <div className="distribution-item" key={item.label}>
            <span className={`distribution-dot ${item.color}`} />
            <div>
              {item.label}
              <strong>
                {formatInteger(item.count)}{" "}
                <span className="font-data">
                  ({formatPercent(item.percentage)})
                </span>
              </strong>
            </div>
          </div>
        ))}
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
            <caption className="sr-only">
              Distribusi wisatawan demonstrasi
            </caption>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Jumlah</th>
                <th>Proporsi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.label}>
                  <td>{item.label}</td>
                  <td>{formatInteger(item.count)}</td>
                  <td>{formatPercent(item.percentage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <span className="sr-only">{provenance.sourceLabel}</span>
    </div>
  );
}
