import { BarChart3, Map, Medal, PieChart, TrendingUp } from "lucide-react";

const icons = {
  map: Map,
  trend: TrendingUp,
  rank: Medal,
  distribution: PieChart,
  status: BarChart3,
};
export function Panel({
  title,
  action,
  icon = "status",
  children,
  className = "",
  flush = false,
}: {
  title: string;
  action?: string;
  icon?: keyof typeof icons;
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
}) {
  const Icon = icons[icon];
  return (
    <section className={`panel ${className}`}>
      <header className="panel-header">
        <h2 className="panel-title">
          <Icon size={17} strokeWidth={2.2} />
          {title}
        </h2>
        {action && <span className="panel-action">{action}</span>}
      </header>
      <div className={`panel-body ${flush ? "flush" : ""}`}>{children}</div>
    </section>
  );
}
