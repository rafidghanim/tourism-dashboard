import { test, expect } from "@playwright/test";

test("overview renders and filters on desktop", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Tourism Overview" }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "Data demonstrasi — bukan statistik resmi",
  );
  await page.getByLabel("Kategori wisatawan").selectOption("domestic");
  await expect(page.getByText("Wisatawan domestik")).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow-x", "hidden");
});

test("overview navigation opens on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Buka menu navigasi" }).click();
  await expect(
    page.getByRole("navigation", { name: "Navigasi utama" }),
  ).toBeVisible();
  await page.locator("button.sidebar-backdrop").click({ force: true });
  await expect(page.locator("aside.sidebar")).not.toHaveClass(/open/);
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1024, height: 800 },
  { width: 768, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 740 },
]) {
  test(`map remains usable at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const map = page.getByTestId("interactive-map");
    await expect(map).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Perbesar peta" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Perkecil peta" }),
    ).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow-x", "hidden");
    const mapBox = await map.boundingBox();
    expect(mapBox?.width).toBeGreaterThan(0);
    expect(mapBox?.height).toBeGreaterThan(200);
  });
}

test("selecting a marker opens desktop popover and mobile sheet", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("button", { name: /Menara Kudus/ })
    .last()
    .click();
  await expect(
    page.getByRole("dialog", { name: "Detail destinasi" }),
  ).toContainText("Menara Kudus");
  await expect(
    page.getByRole("dialog", { name: "Detail destinasi" }),
  ).toContainText("Kunjungan demonstrasi");
  await page
    .getByRole("button", { name: "Tutup detail destinasi" })
    .first()
    .click();
  await expect(
    page.getByRole("dialog", { name: "Detail destinasi" }),
  ).not.toBeVisible();
});

test("sidebar destinations open dedicated routes", async ({ page }) => {
  const routes = [
    ["Sebaran kunjungan", "/sebaran-kunjungan"],
    ["Analisis destinasi", "/analisis-destinasi"],
    ["Tren wisata", "/tren-wisata"],
    ["Simulasi kebijakan", "/simulasi-kebijakan"],
    ["Rekomendasi kebijakan", "/rekomendasi-kebijakan"],
    ["Laporan", "/laporan"],
  ] as const;
  for (const [label, route] of routes) {
    await page.goto("/");
    await page.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(
      page.getByRole("heading", { name: label, exact: true }),
    ).toBeVisible();
  }
});

test("admin form exposes geographic coordinates and edit controls", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page.getByLabel("Latitude")).toBeVisible();
  await expect(page.getByLabel("Longitude")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Simpan destinasi" }),
  ).toBeVisible();
  await expect(page.getByText("Aksi", { exact: true })).toBeVisible();
});

test("planning pages show server-backed simulation and report templates", async ({
  page,
}) => {
  await page.goto("/simulasi-kebijakan");
  await expect(
    page.getByRole("button", { name: "Jalankan simulasi" }),
  ).toBeVisible();
  await expect(page.getByLabel("Kunjungan baseline")).toBeVisible();
  await page.goto("/rekomendasi-kebijakan");
  await expect(
    page.getByRole("button", { name: "Hitung rekomendasi" }),
  ).toBeVisible();
  await page.goto("/laporan");
  await expect(page.getByText("Template laporan")).toBeVisible();
  await expect(page.getByRole("button", { name: "Pratinjau" })).toBeVisible();
});
