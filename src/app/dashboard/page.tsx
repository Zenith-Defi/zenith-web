import Link from "next/link";
import { requireClient } from "@/lib/session";
import { formatAmount, formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { CreateInvoiceForm } from "@/components/create-invoice-form";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const client = requireClient();
  const { data: invoices } = await client.invoices.list({ limit: 50 });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>New invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateInvoiceForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No invoices yet. Create one above.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3">
                      <Link href={`/dashboard/invoices/${invoice.id}`} className="underline">
                        {invoice.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3">{formatAmount(invoice.amount, invoice.asset.code)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{formatDateTime(invoice.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
