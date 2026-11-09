"use client";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  MapPinned,
  Play,
  Sparkles,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { DestinationRanking } from "@/components/destination-ranking";
import { DistributionChart } from "@/components/distribution-chart";
import { InsightCard } from "@/components/insight-card";
import { MapPanel } from "@/components/map-panel";
import { Panel } from "@/components/panel";
import { ProvenanceBanner } from "@/components/provenance-banner";
import { TrendChart } from "@/components/trend-chart";
import { getDemoDashboard } from "@/lib/demo-data";
import {
  createRecommendation,
  createReport,
  createScenario,
  downloadReport,
  Recommendation,
  Report,
  Scenario,
} from "@/lib/policy-api";

const dashboard = getDemoDashboard({
  regionId: "kudus",
  period: "2026-ytd",
  visitorCategory: "all",
});

function Header({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <>
      <DashboardHeader />
      <div className="section-intro">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      <ProvenanceBanner provenance={dashboard.provenance} />
    </>
  );
}

function ActionCard({
  icon: Icon,
  title,
  copy,
  action,
}: {
  icon: typeof Play;
  title: string;
  copy: string;
  action: string;
}) {
  return (
    <article className="action-card">
      <div className="action-icon">
        <Icon size={18} />
      </div>
      <h2>{title}</h2>
      <p>{copy}</p>
      <button className="export-button" type="button">
        {action}
        <ArrowRight size={14} />
      </button>
    </article>
  );
}

export function SectionPage({
  activeNav,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  activeNav: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <AppShell activeNav={activeNav}>
      <Header eyebrow={eyebrow} title={title} subtitle={subtitle} />
      {children}
    </AppShell>
  );
}

export function DistributionPage() {
  return (
    <SectionPage
      activeNav="Sebaran kunjungan"
      eyebrow="Regional intelligence / 02"
      title="Sebaran kunjungan"
      subtitle="Lihat bagaimana kunjungan tersebar di seluruh destinasi Kabupaten Kudus."
    >
      <div className="section-grid section-grid-wide">
        <Panel
          title="Peta sebaran kunjungan"
          icon="map"
          action="Tahun berjalan"
        >
          <MapPanel
            points={dashboard.mapPoints}
            provenance={dashboard.provenance}
          />
        </Panel>
        <Panel title="Distribusi wisatawan" icon="distribution">
          <DistributionChart
            items={dashboard.distribution}
            provenance={dashboard.provenance}
          />
        </Panel>
      </div>
      <div className="metric-strip">
        <div>
          <strong>6</strong>
          <span>destinasi terpetakan</span>
        </div>
        <div>
          <strong>78.120</strong>
          <span>total kunjungan demo</span>
        </div>
        <div>
          <strong>78%</strong>
          <span>proporsi domestik</span>
        </div>
      </div>
    </SectionPage>
  );
}

export function AnalysisPage() {
  return (
    <SectionPage
      activeNav="Analisis destinasi"
      eyebrow="Regional intelligence / 03"
      title="Analisis destinasi"
      subtitle="Bandingkan performa, status, dan peluang setiap destinasi wisata."
    >
      <div className="section-grid">
        <Panel title="Peringkat destinasi" icon="rank" action="Kunjungan">
          <DestinationRanking destinations={dashboard.destinations} />
        </Panel>
        <InsightCard
          insight={dashboard.insight}
          provenance={dashboard.provenance}
        />
      </div>
      <div className="analysis-cards">
        <ActionCard
          icon={Sparkles}
          title="Temukan peluang"
          copy="Identifikasi destinasi dengan momentum pertumbuhan dan kebutuhan intervensi."
          action="Buka analisis"
        />
        <ActionCard
          icon={CheckCircle2}
          title="Pantau kualitas data"
          copy="Tinjau status data sebelum digunakan untuk keputusan kebijakan."
          action="Lihat status"
        />
      </div>
    </SectionPage>
  );
}

export function TrendPage() {
  return (
    <SectionPage
      activeNav="Tren wisata"
      eyebrow="Regional intelligence / 04"
      title="Tren wisata"
      subtitle="Pantau perubahan kunjungan dari waktu ke waktu dengan konteks periode yang jelas."
    >
      <div className="section-grid section-grid-wide">
        <Panel title="Tren kunjungan wisatawan" icon="trend" action="Bulanan">
          <TrendChart
            points={dashboard.trend}
            provenance={dashboard.provenance}
          />
        </Panel>
        <Panel title="Ringkasan periode" icon="status">
          <div className="trend-summary">
            <strong>+9,4%</strong>
            <span>momentum dibanding periode sebelumnya</span>
            <hr />
            <p>
              Seri demonstrasi menunjukkan kenaikan pada paruh kedua tahun
              berjalan. Nilai ini bukan statistik resmi.
            </p>
          </div>
        </Panel>
      </div>
    </SectionPage>
  );
}

export function SimulationPage() {
  const [result, setResult] = useState<Scenario | null>(null);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await createScenario({
        destination_name: data.get("destination_name"),
        period: data.get("period"),
        input_dataset_version_id: "demo-2026-ytd",
        baseline_visits: Number(data.get("baseline")),
        promotion_rate: Number(data.get("promotion")),
        access_rate: Number(data.get("access")),
        event_rate: Number(data.get("event")),
        promotion_elasticity: 0.4,
        access_elasticity: 0.25,
        event_elasticity: 0.3,
        capacity_limit: Number(data.get("capacity")),
        intervention_cost: Number(data.get("cost")),
        assumptions: ["Koefisien elastisitas demonstrasi."],
      });
      setResult(response.data);
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  return (
    <SectionPage
      activeNav="Simulasi kebijakan"
      eyebrow="Planning studio / 01"
      title="Simulasi kebijakan"
      subtitle="Uji asumsi intervensi pariwisata sebelum menjadi rekomendasi kebijakan."
    >
      <div className="scenario-layout">
        <form className="scenario-form policy-form" onSubmit={submit}>
          <div className="eyebrow">Skenario baru</div>
          <h2>Intervensi destinasi</h2>
          <label>
            Destinasi sasaran
            <select name="destination_name">
              <option>Wisata Colo</option>
              <option>Waduk Logung</option>
              <option>Desa Wisata Jangkrik</option>
            </select>
          </label>
          <label>
            Periode
            <input name="period" defaultValue="2027" />
          </label>
          <label>
            Kunjungan baseline
            <input name="baseline" type="number" defaultValue="10000" />
          </label>
          <label>
            Promosi (0–1)
            <input
              name="promotion"
              type="number"
              step=".01"
              defaultValue=".20"
            />
          </label>
          <label>
            Aksesibilitas (0–1)
            <input name="access" type="number" step=".01" defaultValue=".10" />
          </label>
          <label>
            Event (0–1)
            <input name="event" type="number" step=".01" defaultValue=".15" />
          </label>
          <label>
            Kapasitas maksimum
            <input name="capacity" type="number" defaultValue="13000" />
          </label>
          <label>
            Biaya intervensi
            <input name="cost" type="number" defaultValue="100000000" />
          </label>
          <button className="export-button">
            <Play size={14} />
            Jalankan simulasi
          </button>
          {error && (
            <p role="alert" className="admin-error">
              {error}
            </p>
          )}
        </form>
        <div className="scenario-result">
          {result ? (
            <>
              <div className="action-icon">
                <BarChart3 size={18} />
              </div>
              <h2>Hasil simulasi</h2>
              <div className="policy-metrics">
                <span>
                  Proyeksi:{" "}
                  <strong>
                    {Math.round(result.output.projected_visits).toLocaleString(
                      "id-ID",
                    )}
                  </strong>
                </span>
                <span>
                  Tambahan:{" "}
                  <strong>
                    {Math.round(
                      result.output.incremental_visits,
                    ).toLocaleString("id-ID")}
                  </strong>
                </span>
                <span>
                  Efisiensi:{" "}
                  <strong>
                    {result.output.cost_efficiency.toExponential(2)}
                  </strong>
                </span>
              </div>
              <p>{result.output.methodology}</p>
              <small>
                Model {result.output.model_version} · data_class=derived
              </small>
              <p className="demo-tag">{result.output.warnings[0]}</p>
            </>
          ) : (
            <>
              <h2>Hasil simulasi muncul di sini</h2>
              <p>
                Backend menghitung proyeksi, batas kapasitas, dan efisiensi
                dengan input yang tersimpan immutable.
              </p>
            </>
          )}
        </div>
      </div>
      <p className="page-footnote">
        Data demonstrasi — bukan statistik resmi. Simulasi bukan prediksi resmi.
      </p>
    </SectionPage>
  );
}

export function RecommendationPage() {
  const [scenarioId, setScenarioId] = useState("");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const response = await createRecommendation({
        scenario_id: scenarioId,
        title: data.get("title"),
        risk: data.get("risk"),
      });
      setRecommendation(response.data);
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  return (
    <SectionPage
      activeNav="Rekomendasi kebijakan"
      eyebrow="Planning studio / 02"
      title="Rekomendasi kebijakan"
      subtitle="Buat rekomendasi dari ID hasil simulasi yang tersimpan."
    >
      <div className="recommendation-list">
        <form className="recommendation-card policy-form" onSubmit={submit}>
          <h2>Buat rekomendasi</h2>
          <label>
            ID skenario
            <input
              required
              value={scenarioId}
              onChange={(e) => setScenarioId(e.target.value)}
              placeholder="Jalankan simulasi terlebih dahulu"
            />
          </label>
          <label>
            Judul
            <input name="title" required defaultValue="Promosi terarah" />
          </label>
          <label>
            Risiko
            <select name="risk">
              <option>sedang</option>
              <option>rendah</option>
              <option>tinggi</option>
            </select>
          </label>
          <button className="export-button">Hitung rekomendasi</button>
          {error && (
            <p role="alert" className="admin-error">
              {error}
            </p>
          )}
        </form>
        {recommendation && (
          <article className="recommendation-card">
            <span className="recommendation-status">
              {recommendation.priority} · {recommendation.status}
            </span>
            <h2>{recommendation.title}</h2>
            <p>
              Skor: <strong>{(recommendation.score * 100).toFixed(1)}%</strong>
            </p>
            <div className="evidence-row">
              {Object.entries(recommendation.components).map(([key, value]) => (
                <span key={key}>
                  {key}: {(value * 100).toFixed(1)}%
                </span>
              ))}
            </div>
            <p className="demo-tag">Data demonstrasi — bukan statistik resmi</p>
          </article>
        )}
      </div>
    </SectionPage>
  );
}

export function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  async function preview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const response = await createReport({
        template: data.get("template"),
        resource_id: data.get("resource_id") || "dashboard-demo",
        period: data.get("period"),
      });
      setReport(response.data);
      setError("");
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  return (
    <SectionPage
      activeNav="Laporan"
      eyebrow="Documentation / 01"
      title="Laporan"
      subtitle="Pilih template, buat snapshot, lalu ekspor snapshot tersebut."
    >
      <div className="scenario-layout">
        <form className="scenario-form policy-form" onSubmit={preview}>
          <h2>Template laporan</h2>
          <label>
            Template
            <select name="template">
              <option value="tourism_overview">Tourism overview</option>
              <option value="distribution">Laporan sebaran</option>
              <option value="performance_analysis">Analisis performa</option>
              <option value="policy_simulation">
                Hasil simulasi kebijakan
              </option>
              <option value="policy_recommendation">
                Rekomendasi kebijakan
              </option>
            </select>
          </label>
          <label>
            Periode
            <input name="period" defaultValue="2027" />
          </label>
          <label>
            ID skenario/rekomendasi (untuk template kebijakan)
            <input name="resource_id" />
          </label>
          <button className="export-button">Pratinjau</button>
          {error && (
            <p role="alert" className="admin-error">
              {error}
            </p>
          )}
        </form>
        <div className="scenario-result">
          {report ? (
            <>
              <h2>Pratinjau: {report.template}</h2>
              <p>
                Snapshot dibuat{" "}
                {new Date(report.created_at).toLocaleString("id-ID")}. Isi
                ekspor selalu berasal dari template dan snapshot ini.
              </p>
              <div className="admin-form-actions">
                {(["html", "csv", "json"] as const).map((format) => (
                  <button
                    className="export-button"
                    type="button"
                    key={format}
                    onClick={() => void downloadReport(report.id, format)}
                  >
                    Ekspor {format.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="demo-tag">
                Data demonstrasi — bukan statistik resmi
              </p>
            </>
          ) : (
            <>
              <h2>Pratinjau laporan</h2>
              <p>
                Pilih template terlebih dahulu. Laporan tidak dirangkai ulang di
                browser ketika diekspor.
              </p>
            </>
          )}
        </div>
      </div>
    </SectionPage>
  );
}
