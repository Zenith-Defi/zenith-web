import Link from "next/link";
import { requireClient } from "@/lib/session";
import { formatAmount, formatDateTime, truncateMiddle } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const { data: payments } = await requireClient().payments.list({ limit: 50 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {payments.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No payments yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">From</th>
                <th className="px-5 py-3 font-medium">Tx</th>
                <th className="px-5 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-3">
                    {p.invoiceId ? (
                      <Link href={`/dashboard/invoices/${p.invoiceId}`} className="underline">
                        {p.invoiceId}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-3">{formatAmount(p.amount, p.asset.code)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{truncateMiddle(p.fromAccount, 6)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{truncateMiddle(p.txHash, 6)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDateTime(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
