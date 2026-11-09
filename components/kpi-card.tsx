import { Globe2, MapPin, Plane, Users } from "lucide-react";
import { formatInteger } from "@/lib/formatters";
import type { KpiMetric } from "@/lib/types";

const icons = [Users, MapPin, Plane, Globe2];
export function KpiCard({ metric }: { metric: KpiMetric }) {
  const Icon =
    icons[
      ["visits", "destinations", "domestic", "international"].indexOf(metric.id)
    ] ?? Users;
  return (
    <article className="kpi-card">
      <div className="kpi-top">
        <div className="kpi-label">{metric.label}</div>
        <div className="kpi-icon">
          <Icon size={16} />
        </div>
      </div>
      <div className="kpi-value">{formatInteger(metric.value)}</div>
      <div className="kpi-footer">
        <span className={metric.trend === "up" ? "positive" : ""}>
          {metric.comparison}
        </span>
      </div>
      {metric.id === "visits" && (
        <svg
          className="kpi-spark"
          viewBox="0 0 90 38"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 31c8-11 13-7 19-12 7-6 10 4 17-2 8-7 12-16 19-11 8 5 12-4 17-3 5 1 7 6 14-1"
            stroke="var(--accent-teal)"
            strokeWidth="2"
          />
        </svg>
      )}
    </article>
  );
}
