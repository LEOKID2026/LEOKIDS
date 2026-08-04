import { defineConfig, devices } from "@playwright/test";

/** Parent demo acceptance — external base URL, no local webServer spawn. */
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "parent-demo-mode-acceptance.spec.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 45_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "https://leokids.vercel.app",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    locale: "en-US",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
