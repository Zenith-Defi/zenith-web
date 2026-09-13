import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-6 px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Zenith</h1>
      <p className="text-lg text-muted-foreground">
        Accept USDC on Stellar. Invoices settle straight to your own account; Zenith never holds the
        money. This app is the hosted checkout page and the merchant dashboard.
      </p>
      <div className="flex gap-3">
        <Link href="/dashboard">
          <Button>Open dashboard</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Sign in</Button>
        </Link>
      </div>
      <p className="text-sm text-muted-foreground">
        A checkout page lives at <code className="rounded bg-muted px-1.5 py-0.5">/pay/:invoiceId</code>.
      </p>
    </main>
  );
}
