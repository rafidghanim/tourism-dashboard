import { ArrowRight, Lightbulb } from "lucide-react";
import type { Insight, Provenance } from "@/lib/types";

export function InsightCard({
  insight,
  provenance,
}: {
  insight: Insight;
  provenance: Provenance;
}) {
  return (
    <aside className="insight-card">
      <div className="insight-head">
        <Lightbulb size={20} />
        Insight utama
      </div>
      <h2 className="insight-title">{insight.title}</h2>
      <p className="insight-copy">{insight.body}</p>
      <a className="insight-link" href="#evidence">
        Lihat detail <ArrowRight size={14} />
      </a>
      <p className="insight-source">
        {insight.evidence} · {provenance.datasetVersion}
      </p>
    </aside>
  );
}
