import { Info } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import type { Provenance } from "@/lib/types";

export function ProvenanceBanner({ provenance }: { provenance: Provenance }) {
  return (
    <aside className="provenance-banner" role="status">
      <div className="provenance-main">
        <Info size={15} />
        {provenance.sourceLabel}
      </div>
      <div className="provenance-meta">
        Versi {provenance.datasetVersion} · Diperbarui{" "}
        {formatDate(provenance.lastUpdated)}
      </div>
    </aside>
  );
}
