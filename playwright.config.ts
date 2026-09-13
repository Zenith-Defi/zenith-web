import { defineConfig, devices } from "@playwright/test";

// The end-to-end test drives a real paid-invoice flow and needs the full stack
// (zenith-api, its worker and watcher, and this app) plus a funded Testnet key.
// It is opt-in via ZENITH_E2E=1 so `pnpm test` stays green in CI without the
// stack; the test itself skips when the flag is absent.
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: process.env.ZENITH_WEB_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
