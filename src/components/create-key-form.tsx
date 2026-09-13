"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createApiKey } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating…" : "Create key"}
    </Button>
  );
}

export function CreateKeyForm() {
  const [state, action] = useFormState(createApiKey, {});
  return (
    <div className="flex flex-col gap-3">
      <form action={action} className="flex items-end gap-3">
        <label className="text-sm">
          Label
          <Input name="label" placeholder="server" className="mt-1 w-48" />
        </label>
        <Submit />
        {state.error ? <span className="text-sm text-destructive">{state.error}</span> : null}
      </form>
      {state.plaintext ? (
        <div className="rounded-md border border-warning/40 bg-warning/10 p-3 text-sm">
          <p className="mb-1 font-medium">Copy this key now. It is shown only once.</p>
          <div className="flex items-center gap-2">
            <code className="break-all">{state.plaintext}</code>
            <CopyButton value={state.plaintext} label="" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
