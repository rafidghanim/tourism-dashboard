import { describe, expect, it } from "vitest";
import { formatInteger, formatPercent } from "@/lib/formatters";
describe("formatters", () => { it("formats Indonesian values and null states", () => { expect(formatInteger(128450)).toBe("128.450"); expect(formatPercent(12.8)).toBe("12,8%"); expect(formatInteger(null)).toBe("—"); }); });
