import { ArrowUpRight, Landmark } from "lucide-react";
import { formatInteger, formatPercent } from "@/lib/formatters";
import type { DestinationSummary } from "@/lib/types";

function Row({
  destination,
  index,
}: {
  destination: DestinationSummary;
  index: number;
}) {
  return (
    <>
      <td>{index + 1}</td>
      <td>
        <div className="destination-cell">
          <span className="destination-thumb">
            <Landmark size={14} />
          </span>
          {destination.name}
        </div>
      </td>
      <td className="font-data">{formatInteger(destination.visits)}</td>
      <td className={destination.growth >= 0 ? "positive" : "status-danger"}>
        <ArrowUpRight size={12} /> {formatPercent(destination.growth)}
      </td>
      <td>
        <span className={`status-pill ${destination.status}`}>
          {destination.status === "good"
            ? "Sangat baik"
            : destination.status === "attention"
              ? "Perlu perhatian"
              : "Perlu evaluasi"}
        </span>
      </td>
    </>
  );
}
export function DestinationRanking({
  destinations,
}: {
  destinations: DestinationSummary[];
}) {
  return (
    <div>
      <table className="ranking-table">
        <caption className="sr-only">Peringkat destinasi demonstrasi</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Destinasi</th>
            <th>Kunjungan</th>
            <th>Pertumbuhan</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {destinations.slice(0, 4).map((destination, index) => (
            <tr key={destination.id}>
              <Row destination={destination} index={index} />
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ranking-mobile">
        {destinations.slice(0, 4).map((destination, index) => (
          <div className="ranking-mobile-row" key={destination.id}>
            <div className="ranking-mobile-meta">
              <strong>{index + 1}.</strong>
              <span>{destination.name}</span>
            </div>
            <span className="status-pill good">
              {formatInteger(destination.visits)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
