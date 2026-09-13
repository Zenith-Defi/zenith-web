"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createEndpoint } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding…" : "Add endpoint"}
    </Button>
  );
}

export function CreateEndpointForm() {
  const [state, action] = useFormState(createEndpoint, {});
  return (
    <div className="flex flex-col gap-3">
      <form action={action} className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          URL
          <Input name="url" placeholder="https://example.com/webhooks/zenith" className="mt-1 w-80" />
        </label>
        <label className="text-sm">
          Events (comma-separated, blank for all)
          <Input name="events" placeholder="invoice.paid,invoice.underpaid" className="mt-1 w-72" />
        </label>
        <Submit />
        {state.error ? <span className="text-sm text-destructive">{state.error}</span> : null}
      </form>
      {state.secret ? (
        <div className="rounded-md border border-warning/40 bg-warning/10 p-3 text-sm">
          <p className="mb-1 font-medium">Signing secret. Shown only once; store it to verify signatures.</p>
          <div className="flex items-center gap-2">
            <code className="break-all">{state.secret}</code>
            <CopyButton value={state.secret} label="" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
