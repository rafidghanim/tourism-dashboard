import type { DashboardFilters, VisitorCategory } from "@/lib/types";

export function FilterBar({
  value,
  onChange,
  onReset,
}: {
  value: DashboardFilters;
  onChange: (value: DashboardFilters) => void;
  onReset: () => void;
}) {
  return (
    <div className="filter-bar" aria-label="Filter dashboard">
      <label className="sr-only" htmlFor="region">
        Wilayah
      </label>
      <select
        id="region"
        className="filter-select"
        value={value.regionId}
        onChange={(e) => onChange({ ...value, regionId: e.target.value })}
      >
        <option value="kudus">Kabupaten Kudus</option>
      </select>
      <label className="sr-only" htmlFor="period">
        Periode
      </label>
      <select
        id="period"
        className="filter-select"
        value={value.period}
        onChange={(e) => onChange({ ...value, period: e.target.value })}
      >
        <option value="2026-ytd">Jan – Nov 2026</option>
        <option value="2025-ytd">Jan – Nov 2025</option>
      </select>
      <label className="sr-only" htmlFor="category">
        Kategori wisatawan
      </label>
      <select
        id="category"
        className={`filter-select ${value.visitorCategory === "all" ? "category-all" : ""}`}
        value={value.visitorCategory}
        onChange={(e) =>
          onChange({
            ...value,
            visitorCategory: e.target.value as VisitorCategory,
          })
        }
      >
        <option value="all">Semua</option>
        <option value="domestic">Domestik</option>
        <option value="international">Mancanegara</option>
      </select>
      <button className="reset-button" type="button" onClick={onReset}>
        Reset filter
      </button>
    </div>
  );
}
