import { publicApiUrl } from "@/lib/env";
import { CheckoutClient } from "./checkout-client";

// Render per request so the API URL is read from the environment at runtime,
// not captured at build time.
export const dynamic = "force-dynamic";

// The checkout page is public: no API key. It renders a shell and lets the
// client subscribe to the invoice's server-sent events stream, which the API
// exposes without auth. The first `snapshot` event carries the invoice, so the
// page never needs an authenticated fetch.
export default function CheckoutPage({ params }: { params: { invoiceId: string } }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <CheckoutClient invoiceId={params.invoiceId} apiUrl={publicApiUrl} />
    </main>
  );
}
