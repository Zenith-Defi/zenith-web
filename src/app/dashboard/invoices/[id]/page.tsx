import Link from "next/link";
import { notFound } from "next/navigation";
import { ZenithApiError } from "@zenithpay/sdk";
import { requireClient } from "@/lib/session";
import { checkoutBaseUrl } from "@/lib/env";
import { formatAmount, formatDateTime, truncateMiddle } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { CopyButton } from "@/components/copy-button";
import { cancelInvoice } from "../../actions";

export const dynamic = "force-dynamic";

export default async function InvoiceDetail({ params }: { params: { id: string } }) {
  const client = requireClient();

  let invoice;
  try {
    invoice = await client.invoices.get(params.id);
  } catch (err) {
    if (err instanceof ZenithApiError && err.status === 404) notFound();
    throw err;
  }

  const { data: allPayments } = await client.payments.list({ limit: 100 });
  const payments = allPayments.filter((p) => p.invoiceId === invoice.id);
  const checkoutUrl = `${checkoutBaseUrl}/pay/${invoice.id}`;
  const cancellable = invoice.status === "open" || invoice.status === "underpaid";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Back to invoices
          </Link>
          <h1 className="text-2xl font-semibold">Invoice {invoice.id}</h1>
          <StatusBadge status={invoice.status} />
        </div>
        {cancellable ? (
          <form action={cancelInvoice}>
            <input type="hidden" name="id" value={invoice.id} />
            <Button variant="outline" size="sm" type="submit">
              Cancel invoice
            </Button>
          </form>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <Row label="Amount" value={formatAmount(invoice.amount, invoice.asset.code)} />
            <Row label="Received" value={formatAmount(invoice.amountReceived, invoice.asset.code)} />
            <Row label="Memo" value={invoice.memo ?? "—"} />
            <Row label="Expires" value={formatDateTime(invoice.expiresAt)} />
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Pay-to address</span>
              <span className="flex items-center gap-2">
                <code>{truncateMiddle(invoice.muxedAddress, 8)}</code>
                <CopyButton value={invoice.muxedAddress} label="" />
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Checkout</span>
              <Link href={checkoutUrl} className="underline" target="_blank">
                Open page
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <TimelineItem when={invoice.createdAt} title="Invoice created" />
            {payments.map((p) => (
              <TimelineItem
                key={p.id}
                when={p.createdAt}
                title={`Payment received: ${formatAmount(p.amount, p.asset.code)}`}
                detail={`from ${truncateMiddle(p.fromAccount, 6)} · tx ${truncateMiddle(p.txHash, 6)}`}
              />
            ))}
            {invoice.paidAt ? <TimelineItem when={invoice.paidAt} title="Marked paid" /> : null}
            {payments.length === 0 && !invoice.paidAt ? (
              <p className="text-muted-foreground">No payments yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function TimelineItem({ when, title, detail }: { when: string; title: string; detail?: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
      <div>
        <p className="font-medium">{title}</p>
        {detail ? <p className="text-muted-foreground">{detail}</p> : null}
        <p className="text-xs text-muted-foreground">{formatDateTime(when)}</p>
      </div>
    </div>
  );
}
