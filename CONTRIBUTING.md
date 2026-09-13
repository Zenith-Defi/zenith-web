# Contributing to zenith-web

Thanks for helping build the Zenith app. This gets you from a cold clone to a useful pull request in a day, even if you have never touched Stellar.

## What this repository is, and the other two

Zenith is a non-custodial crypto checkout on Stellar: a merchant creates an invoice, a customer pays it, and the money lands in the merchant's own account. This repository is the app: the public checkout page and the merchant dashboard.

- **[zenith-api](https://github.com/Elizabethxxx/zenith-api)** — the REST API.
- **[zenith-sdk](https://github.com/Elizabethxxx/zenith-sdk)** — the TypeScript client this app uses.
- **zenith-web** (you are here) — the checkout page and dashboard.

Dependencies point one way: api, then sdk, then web, never reversed. This app talks to the API only through the SDK. If the app needs something the SDK cannot do, the fix goes in the SDK, not a raw `fetch` here. The cross-repository rules are in [docs/multi-repo.md](docs/multi-repo.md).

## The domain in two minutes

A **Stellar account** is a public key starting with `G`; the merchant has one and Zenith holds no key for it. Each invoice gets a **muxed address** (`M...`), the merchant account plus the invoice id, and a payment to it lands in the merchant account with the id attached. **Stroops** are the integer unit of an amount (one unit is 10,000,000 stroops); amounts are stroop strings and are formatted for display without ever becoming a float (`src/lib/format.ts`). The checkout page shows a **SEP-0007** `web+stellar:pay` URI as a QR code, which any Stellar wallet understands.

The normative contract is the API's OpenAPI document, surfaced here through the SDK's types. Follow them.

## Repository map

```
src/
  app/
    page.tsx                 landing
    login/                   API-key login and its server action
    pay/[invoiceId]/         public checkout page (server shell + SSE client)
    dashboard/
      layout.tsx             auth guard and nav
      page.tsx               invoice list and create form
      invoices/[id]/         invoice detail and payment timeline
      payments/              payments list
      api-keys/              create and revoke keys
      webhooks/              endpoints and their delivery log
      settings/              merchant profile
      actions.ts             server actions; all SDK calls run here
  components/
    ui/                      button, card, input, status badge
    copy-button.tsx          client clipboard control
    create-*.tsx             client forms using server actions
  lib/
    session.ts               API key in an httpOnly cookie; requireClient()
    sdk (via session)        server-side SDK client
    format.ts                stroop and date formatting
    env.ts                   API and checkout URLs
tests/checkout.spec.ts       opt-in end-to-end paid-invoice flow
```

## Getting set up

Prerequisites: Node 20 or newer, pnpm 9 (`corepack enable`). You also need [zenith-api](https://github.com/Elizabethxxx/zenith-api) running locally with a seeded API key; its README has the steps, and you do not need to deploy anything of your own.

```bash
git clone https://github.com/Elizabethxxx/zenith-web
cd zenith-web
pnpm install
cp .env.example .env
pnpm dev            # http://localhost:3000
```

Sign in with the API key that zenith-api's `pnpm seed` printed. Create an invoice, open its checkout page, and pay it from a Testnet wallet; it flips to paid. A passing `pnpm build` also proves your setup:

```bash
pnpm build
```

To run against your local build of the SDK instead of the pinned git version, link it:

```bash
# in zenith-sdk
pnpm build && pnpm link --global
# here
pnpm link --global @zenithpay/sdk
```

## Where to start

Issues carry `good first issue`, `intermediate`, or `advanced`. The full list with acceptance criteria is in [ISSUES.md](ISSUES.md); here it is ordered easiest to hardest.

1. **More wallet deep links** (`good first issue`). Named wallet buttons on checkout, falling back to the SEP-0007 URI. `src/app/pay`.
2. **Accessibility pass** (`good first issue`). Keyboard and screen-reader support on the checkout page, including the paid announcement.
3. **Invoice list filters and pagination** (`intermediate`). Status filters and cursor paging via the SDK. `src/app/dashboard`.
4. **Magic-link email login** (`intermediate`). An email alternative to API-key login.
5. **Internationalisation** (`intermediate`). Locale-aware copy and formatting.
6. **Refunds screen** (`advanced`). Waits on API and SDK refund support.
7. **Settlement and anchor screen** (`advanced`). Waits on the API's anchor work.
8. **Embeddable checkout widget** (`advanced`). The single largest piece: an inline, cross-origin checkout built on the SDK's browser bundle.

Claim an issue by commenting. Open a discussion first for anything that changes a shared flow or the checkout page, since it is the product surface.

## Rules that matter here

**Everything goes through the SDK.** No raw `fetch` to the API, no duplicated request or response types. If the SDK is missing something, add it there and depend on the new version.

**No custody, no secret keys.** No page asks a user for a Stellar secret key. The app displays state and initiates payments the user's own wallet signs; it never holds funds or keys.

**The API key never reaches the browser.** It is an httpOnly cookie read only in server code and server actions. Do not pass it to a client component or put it in a URL.

**Amounts are stroop strings.** Format for display with `src/lib/format.ts`. Never convert an amount to a `number`.

**The checkout page stays fast and public.** It has no auth and must work well on a phone; it is the product.

## Code style

TypeScript, React Server Components where possible. ESLint via `next lint`; no separate formatter. [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `docs:`, and so on. Branch names like `feat/invoice-filters`.

CI runs exactly these and they must pass:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm test` runs Playwright; the end-to-end flow is opt-in via `ZENITH_E2E=1` and skips otherwise, so it is green without a running stack.

## Pull request checklist

- [ ] Branch off `main`, Conventional Commit messages.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass.
- [ ] All API access goes through the SDK; no raw `fetch`, no duplicated types.
- [ ] No secret key is requested anywhere; the API key stays server-side.
- [ ] UI changes checked on a narrow (phone) viewport.
- [ ] If this needs a matching change in zenith-api or zenith-sdk, that pull request is linked here.

## Releases

Maintainers deploy from `main`; the app is not versioned for consumers. Tags exist for changelog purposes only. Do not edit environment or deployment configuration in a feature pull request.

## Security

Report vulnerabilities privately per [SECURITY.md](SECURITY.md), never in a public issue. The sensitive surfaces are session handling, the public checkout page, and the server actions. Zenith is unaudited and Testnet-only.

## Community

Design discussion happens in GitHub Discussions. This is an application repository, so commit rights are granted readily once you have a couple of merged pull requests; a change to a shared flow or the checkout page still wants agreement first. Contrast this with the API and SDK, where commit rights come slowly because a bad change there reaches every consumer.
