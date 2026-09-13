# zenith-web

The hosted checkout page and merchant dashboard for [Zenith](https://github.com/Zenith-Defi/zenith-api), a non-custodial crypto checkout on Stellar. A customer pays an invoice on `/pay/:invoiceId`; a merchant manages invoices, payments, API keys and webhooks in the dashboard.

This is the application layer of a three-repository project.

- [zenith-api](https://github.com/Zenith-Defi/zenith-api) — the REST API.
- [zenith-sdk](https://github.com/Zenith-Defi/zenith-sdk) — the TypeScript client.
- **zenith-web** (this repo) — this app. It talks to the API only through the SDK.

Dependencies point one way: api, then sdk, then web. This app never calls the API with a raw `fetch` and never re-implements SDK logic. See [docs/multi-repo.md](docs/multi-repo.md).

## Stack

Next.js App Router, TypeScript, Tailwind CSS, and small shadcn-style UI components. The SDK is consumed as `@zenithpay/sdk`.

## Requirements

- Node 20 or newer
- pnpm 9
- A running [zenith-api](https://github.com/Zenith-Defi/zenith-api) with a seeded API key

## Quickstart

Start the API first (see its README), then:

```bash
pnpm install
cp .env.example .env         # point the URLs at your local API
pnpm dev                     # app on http://localhost:3000
```

Open http://localhost:3000, sign in with the API key `pnpm seed` printed in zenith-api, and you land in the dashboard. Create an invoice, open its checkout page, pay it from a Testnet wallet, and watch it flip to paid.

## How it fits together

The dashboard runs its API calls on the server through the SDK, using the merchant's API key held in an httpOnly cookie. The key never reaches the browser.

The checkout page is public and has no API key. It subscribes to the API's server-sent events stream for the invoice, which sends the invoice as a `snapshot` and then `update` events, so the page renders the amount, a SEP-0007 QR code and the pay-to address, and flips to paid within a second of detection.

## Configuration

See `.env.example`.

- `ZENITH_API_URL` — the API, used by server-side SDK calls.
- `NEXT_PUBLIC_ZENITH_API_URL` — the same API, exposed to the browser for the SSE stream.
- `NEXT_PUBLIC_CHECKOUT_BASE_URL` — this app's own base URL, for building checkout links.

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint` / `pnpm typecheck`
- `pnpm test` — Playwright; the end-to-end flow is opt-in (see below)

## End-to-end test

`tests/checkout.spec.ts` drives the full paid-invoice path: create an invoice, pay the muxed address from a fresh Testnet account, and assert the page flips to paid. It is opt-in because it needs the full stack and Testnet access:

```bash
pnpm test:install            # once, to get the browser
ZENITH_E2E=1 ZENITH_API_KEY=zk_test_... pnpm test
```

Without `ZENITH_E2E=1` the test skips, so CI stays green without the stack.

## Status

Built to roughly 65%. Working: the public checkout page with QR, copy-address, wallet deep link and live status; and the dashboard with invoices (list, detail, create, cancel), payments, API key create and revoke, webhook endpoints with their delivery log and replay, and settings. Login is via API key. Not built and filed in [ISSUES.md](ISSUES.md): magic-link email login, refunds and settlement screens, the embeddable widget, i18n and a full accessibility pass.

Unaudited and Testnet-only. See [SECURITY.md](SECURITY.md).

## License

Apache-2.0.
