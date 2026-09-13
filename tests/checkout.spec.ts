import { test, expect } from "@playwright/test";
import {
  Asset,
  Horizon,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { Zenith } from "@zenithpay/sdk";

// Full paid-invoice path against a local stack. Opt-in:
//   ZENITH_E2E=1 ZENITH_API_KEY=zk_test_... pnpm test
// Requires zenith-api (+ worker + watcher) and this app running, and network
// access to Testnet Friendbot and Horizon.
const enabled = process.env.ZENITH_E2E === "1";
const apiKey = process.env.ZENITH_API_KEY ?? "";
const apiUrl = process.env.ZENITH_API_URL ?? "http://localhost:8787";
const horizonUrl = process.env.HORIZON_URL ?? "https://horizon-testnet.stellar.org";

test.skip(!enabled || !apiKey, "Set ZENITH_E2E=1 and ZENITH_API_KEY to run the end-to-end flow");

test("checkout page flips to paid after a Testnet payment", async ({ page }) => {
  const zenith = new Zenith({ apiKey, baseUrl: apiUrl });
  const invoice = await zenith.invoices.create({
    amount: "10000000",
    asset: { code: "XLM", issuer: null },
    memo: "e2e",
  });

  await page.goto(`/pay/${invoice.id}`);
  await expect(page.getByText(`Invoice ${invoice.id}`)).toBeVisible();

  // Pay the muxed address from a fresh funded account.
  const payer = Keypair.random();
  const fund = await fetch(`https://friendbot.stellar.org/?addr=${payer.publicKey()}`);
  expect(fund.ok).toBeTruthy();

  const server = new Horizon.Server(horizonUrl);
  const account = await server.loadAccount(payer.publicKey());
  const tx = new TransactionBuilder(account, { fee: "1000", networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.payment({ destination: invoice.muxedAddress, asset: Asset.native(), amount: "1.0000000" }))
    .setTimeout(60)
    .build();
  tx.sign(payer);
  await server.submitTransaction(tx);

  // The watcher detects the payment and the SSE stream flips the page.
  await expect(page.getByText("Payment received")).toBeVisible({ timeout: 30_000 });
});
