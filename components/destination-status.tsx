import type { DestinationStatusItem } from "@/lib/types";
import { formatPercent } from "@/lib/formatters";

export function DestinationStatus({
  items,
}: {
  items: DestinationStatusItem[];
}) {
  return (
    <div className="status-grid">
      {items.map((item) => (
        <div className={`status-card ${item.status}`} key={item.id}>
          <div className="status-number">{formatPercent(item.percentage)}</div>
          <div className="status-label">{item.label}</div>
          <div className="status-bar" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
