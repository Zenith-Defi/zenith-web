"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { stellarPayUri, type Invoice } from "@zenithpay/sdk/browser";
import { formatAmount, formatStroops } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { StatusBadge } from "@/components/ui/status-badge";

type State = { invoice: Invoice | null; error: string | null; connected: boolean };

export function CheckoutClient({ invoiceId, apiUrl }: { invoiceId: string; apiUrl: string }) {
  const [state, setState] = useState<State>({ invoice: null, error: null, connected: false });

  useEffect(() => {
    const source = new EventSource(`${apiUrl}/v1/invoices/${encodeURIComponent(invoiceId)}/events`);
    source.addEventListener("open", () => setState((s) => ({ ...s, connected: true })));
    const onInvoice = (raw: string) => {
      try {
        const data = JSON.parse(raw) as Invoice | { invoice: Invoice };
        const invoice = "invoice" in data ? data.invoice : data;
        setState((s) => ({ ...s, invoice, error: null }));
      } catch {
        // Ignore a malformed frame; the next one will refresh state.
      }
    };
    source.addEventListener("snapshot", (e) => onInvoice((e as MessageEvent).data));
    source.addEventListener("update", (e) => onInvoice((e as MessageEvent).data));
    source.addEventListener("error", () => setState((s) => ({ ...s, connected: false })));
    return () => source.close();
  }, [invoiceId, apiUrl]);

  const invoice = state.invoice;
  const paid = invoice?.status === "paid" || invoice?.status === "overpaid";

  const payUri = useMemo(() => {
    if (!invoice) return "";
    const displayAmount = formatStroops(invoice.amount);
    return stellarPayUri({
      destination: invoice.muxedAddress,
      amount: displayAmount,
      assetCode: invoice.asset.code === "XLM" ? undefined : invoice.asset.code,
      assetIssuer: invoice.asset.issuer ?? undefined,
      memo: invoice.memo ?? undefined,
    });
  }, [invoice]);

  if (!invoice) {
    return (
      <Card>
        <CardContent className="text-center text-sm text-muted-foreground">
          {state.error ?? "Loading invoice…"}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-5 text-center">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm text-muted-foreground">Invoice {invoice.id}</span>
          <StatusBadge status={invoice.status} />
        </div>

        <div>
          <p className="text-3xl font-semibold">{formatAmount(invoice.amount, invoice.asset.code)}</p>
          {invoice.currencyDisplay ? (
            <p className="text-sm text-muted-foreground">{invoice.currencyDisplay}</p>
          ) : null}
        </div>

        {paid ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-2xl text-success">
              ✓
            </div>
            <p className="text-lg font-medium">Payment received</p>
            <p className="text-sm text-muted-foreground">You can close this page.</p>
          </div>
        ) : (
          <>
            <div className="rounded-lg bg-white p-4">
              <QRCodeSVG value={payUri} size={200} includeMargin />
            </div>
            <p className="text-sm text-muted-foreground">Scan with a Stellar wallet, or pay this address:</p>
            <div className="flex w-full items-center justify-between gap-2 rounded-md border border-border p-3">
              <code className="truncate text-xs">{invoice.muxedAddress}</code>
              <CopyButton value={invoice.muxedAddress} label="" />
            </div>
            <a
              href={payUri}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Open in wallet
            </a>
            {invoice.memo ? (
              <p className="text-xs text-muted-foreground">Memo: {invoice.memo}</p>
            ) : null}
          </>
        )}

        <p className="text-xs text-muted-foreground">
          {state.connected ? "Live" : "Reconnecting…"} · Stellar Testnet · Zenith never holds your funds
        </p>
      </CardContent>
    </Card>
  );
}
