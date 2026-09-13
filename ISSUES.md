# Open work — zenith-web

The remaining app work, filed for contributors. Labels: `good first issue`, `intermediate`, `advanced`. The matching API and SDK work lives in `zenith-api/ISSUES.md` and `zenith-sdk/ISSUES.md`.

Claim an issue by commenting on it.

## More wallet deep links

`good first issue`. The checkout page offers a SEP-0007 `web+stellar:pay` link and a QR code. Add explicit buttons for common wallets that support their own deep-link scheme, with graceful fallback to the SEP-0007 URI.

Acceptance criteria: at least two named wallet buttons; the SEP-0007 link remains the default; nothing breaks on desktop where the scheme is unhandled.

## Accessibility pass

`good first issue`. The checkout page is the product and must be usable with a keyboard and a screen reader. Audit focus order, labels, colour contrast, and the live-region announcement when the invoice flips to paid.

Acceptance criteria: the paid transition is announced to assistive tech; all interactive elements are reachable and labelled; contrast meets WCAG AA.

## Invoice list filters and pagination

`intermediate`. The invoice list shows the first 50. Add status filters and cursor pagination using the SDK's `nextCursor`.

Acceptance criteria: filter by status; a load-more or paged control uses `nextCursor`; the URL reflects the filter so it is shareable.

## Magic-link email login

`intermediate`. Login is by API key today. Add an email magic-link flow as an alternative, issuing a session on click. Requires a mail sender and a short-lived token store.

Acceptance criteria: request a link by email, click it, land authenticated; tokens are single-use and expire; the API-key login still works. Pairs with multi-user accounts in `zenith-api/ISSUES.md`.

## Internationalisation

`intermediate`. Extract UI copy and format amounts, dates and currencies by locale. The checkout page is seen by customers worldwide.

Acceptance criteria: copy comes from message catalogues; at least one non-English locale ships; amount and date formatting are locale-aware without touching the stroop values.

## Refunds screen

`advanced`. When the API gains refunds (see `zenith-api/ISSUES.md`), add a dashboard screen to issue and track them, through the SDK. Depends on the API and SDK work landing first.

Acceptance criteria: issue a refund from an invoice; the refund appears in a list with its status; no direct API calls, only the SDK.

## Settlement and anchor screen

`advanced`. When anchor settlement lands in the API, add screens to connect an anchor, set a threshold, and view settlement rows linking to the anchor transaction. Depends on the API's largest piece.

Acceptance criteria: connect an anchor and run the SEP-10 step through the SDK; view settlements with their anchor transaction id; the non-custody guarantee is visible to the merchant.

## Embeddable checkout widget

`advanced`. The single largest piece. Turn the checkout into an embeddable widget a merchant drops into their own page, built on the SDK's browser bundle, without an iframe full-page redirect.

Acceptance criteria: a script tag or component renders the checkout inline; it subscribes to the SSE stream and reports success back to the host page; it works cross-origin and carries no secret.
