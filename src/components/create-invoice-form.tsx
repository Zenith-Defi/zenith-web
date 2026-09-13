"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { createInvoice } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating…" : "Create invoice"}
    </Button>
  );
}

export function CreateInvoiceForm() {
  const [state, action] = useFormState(createInvoice, {});
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <label className="text-sm">
        Amount
        <Input name="amount" placeholder="12.5" className="mt-1 w-32" inputMode="decimal" />
      </label>
      <label className="text-sm">
        Asset code
        <Input name="assetCode" defaultValue="XLM" className="mt-1 w-28" />
      </label>
      <label className="text-sm">
        Issuer (blank for XLM)
        <Input name="issuer" placeholder="G..." className="mt-1 w-64" />
      </label>
      <label className="text-sm">
        Memo
        <Input name="memo" placeholder="order-1" className="mt-1 w-40" />
      </label>
      <Submit />
      {state.error ? <span className="text-sm text-destructive">{state.error}</span> : null}
      {state.id ? (
        <Link href={`/dashboard/invoices/${state.id}`} className="text-sm underline">
          Created invoice {state.id}
        </Link>
      ) : null}
    </form>
  );
}
