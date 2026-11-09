import { describe, expect, it } from "vitest";
import { getDemoDashboard } from "@/lib/demo-data";

describe("demo dashboard adapter", () => {
  it("marks fixture responses as demonstration data", () => { const data = getDemoDashboard({ regionId: "kudus", period: "2026-ytd", visitorCategory: "all" }); expect(data.provenance.dataClass).toBe("demonstration"); expect(data.provenance.isDemo).toBe(true); });
  it("filters category data deterministically", () => { const all = getDemoDashboard({ regionId: "kudus", period: "2026-ytd", visitorCategory: "all" }); const domestic = getDemoDashboard({ regionId: "kudus", period: "2026-ytd", visitorCategory: "domestic" }); expect(domestic.kpis.totalVisits).toBeLessThan(all.kpis.totalVisits); });
});
