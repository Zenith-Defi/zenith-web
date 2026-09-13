# Security Policy

zenith-web targets Stellar Testnet only and is unaudited.

## Reporting a vulnerability

Report privately to security@zenith.example. Do not open a public issue. The same address is used across all three Zenith repositories.

## Sensitive surfaces in this repository

- **Session handling** (`src/lib/session.ts`). The API key is the session and lives in an httpOnly cookie. It must never be sent to the browser, logged, or placed in a URL. Every authenticated call runs on the server.
- **The checkout page** (`src/app/pay/`). It is public and must stay read-only: it renders invoice data from the SSE stream and never accepts or transmits a secret. No page in this app may ask a user for a Stellar secret key.
- **Server actions** (`src/app/dashboard/actions.ts`). Each action resolves the client from the session; none accepts an API key or merchant id from the form. Do not add one.

## What this app does not do

It never takes custody and never handles a Stellar secret key. Payments go from the customer's wallet to the merchant's account; this app only displays state.
