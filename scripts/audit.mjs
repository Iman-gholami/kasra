import { spawn } from "node:child_process";
import { mkdir, writeFile, appendFile } from "node:fs/promises";
import { cpus, totalmem, release } from "node:os";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { chromium } from "@playwright/test";

const origin = "http://127.0.0.1:3000";
const out = "audit-results";
await mkdir(out, { recursive: true });
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1"],
  { stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } },
);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const routes = [
  { name: "home", path: "/" },
  { name: "shop", path: "/shop" },
  { name: "product", path: "/product/shomiz-1" },
];
const results = [];
const median = (values) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(origin)).ok) {
        ready = true;
        break;
      }
    } catch {}
    await delay(1000);
  }
  if (!ready) throw Error("Production server did not become ready");
  for (const route of routes) {
    const runs = [];
    for (let index = 1; index <= 3; index++) {
      const chrome = await launch({
        chromePath: chromium.executablePath(),
        chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
      });
      try {
        const result = await lighthouse(origin + route.path, {
          port: chrome.port,
          output: "html",
          logLevel: "error",
          onlyCategories: ["performance", "accessibility"],
          formFactor: "mobile",
          throttlingMethod: "simulate",
        });
        if (!result || result.lhr.runtimeError)
          throw Error(JSON.stringify(result?.lhr.runtimeError));
        const lhr = result.lhr;
        await writeFile(`${out}/${route.name}-${index}.html`, result.report);
        await writeFile(
          `${out}/${route.name}-${index}.json`,
          JSON.stringify(lhr, null, 2),
        );
        const metrics = {
          performance: Math.round(lhr.categories.performance.score * 100),
          accessibility: Math.round(lhr.categories.accessibility.score * 100),
          lcpMs: lhr.audits["largest-contentful-paint"].numericValue,
          cls: lhr.audits["cumulative-layout-shift"].numericValue,
          tbtMs: lhr.audits["total-blocking-time"].numericValue,
        };
        runs.push(metrics);
        console.log(
          "AUDIT_SAMPLE",
          JSON.stringify({ route: route.path, index, ...metrics }),
        );
        if (results.length === 0 && index === 1)
          await writeFile(
            `${out}/environment.json`,
            JSON.stringify(
              {
                node: process.version,
                os: release(),
                cpu: cpus()[0]?.model,
                cpuCount: cpus().length,
                memoryBytes: totalmem(),
                lighthouse: lhr.lighthouseVersion,
                userAgent: lhr.userAgent,
                settings: lhr.configSettings,
                fetchTime: lhr.fetchTime,
                commit: process.env.GITHUB_SHA,
                cache:
                  "Fresh Chrome process for every sample; Lighthouse storage reset enabled. Origin and image-optimization caches may be warm from earlier CI checks.",
              },
              null,
              2,
            ),
          );
      } finally {
        await chrome.kill();
      }
    }
    const summary = {
      route: route.path,
      runs,
      median: Object.fromEntries(
        Object.keys(runs[0]).map((key) => [
          key,
          median(runs.map((r) => r[key])),
        ]),
      ),
    };
    results.push(summary);
    console.log("AUDIT_MEDIAN", JSON.stringify(summary));
  }
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      for (const route of routes) {
        await page.goto(origin + route.path);
        await page.evaluate(() => document.fonts.ready);
        await page.locator("main img").first().waitFor();
        await page.locator("main img").evaluateAll((images) =>
          Promise.all(
            images.map((img) => {
              img.loading = "eager";
              return img.decode().catch(() => {});
            }),
          ),
        );
        await page.screenshot({
          path: `${out}/${route.name}-${width}.png`,
          fullPage: true,
        });
      }
      await page.getByRole("button", { name: "شیری", exact: true }).click();
      await page.getByRole("button", { name: "سایز S", exact: true }).click();
      await page
        .getByRole("button", { name: "افزودن به سبد خرید", exact: true })
        .click();
      for (const route of ["cart", "checkout"]) {
        await page.goto(`${origin}/${route}`);
        await page.getByText("خلاصه سفارش", { exact: true }).waitFor();
        await page.screenshot({
          path: `${out}/${route}-${width}.png`,
          fullPage: true,
        });
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
  await writeFile(`${out}/summary.json`, JSON.stringify(results, null, 2));
  const table = [
    "| Page | Mobile performance | Accessibility | LCP (ms) | CLS | TBT (ms) |",
    "|---|---:|---:|---:|---:|---:|",
    ...results.map(
      (r) =>
        `| ${r.route} | ${r.median.performance} | ${r.median.accessibility} | ${Math.round(r.median.lcpMs)} | ${r.median.cls.toFixed(3)} | ${Math.round(r.median.tbtMs)} |`,
    ),
  ];
  const report =
    "# Lighthouse lab results\n\nMedian of three fresh-browser mobile simulated-throttling runs per route. These are CI lab measurements, not real-user metrics. Settings and environment are preserved in environment.json.\n\n" +
    table.join("\n") +
    "\n";
  await writeFile(`${out}/SUMMARY.md`, report);
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(process.env.GITHUB_STEP_SUMMARY, report);
} finally {
  server.kill("SIGTERM");
}
