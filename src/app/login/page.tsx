"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Checking…" : "Sign in"}
    </Button>
  );
}

export default function LoginPage() {
  const [error, formAction] = useFormState(login, undefined);
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Card>
        <CardHeader>
          <CardTitle>Sign in to Zenith</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <label className="text-sm">
              API key
              <Input name="apiKey" type="password" placeholder="zk_test_..." autoComplete="off" className="mt-1" />
            </label>
            <p className="text-sm text-muted-foreground">
              Your API key is your login. Run <code className="rounded bg-muted px-1 py-0.5">pnpm seed</code> in
              zenith-api to get one. The key stays on the server; it is never exposed to the browser.
            </p>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Submit />
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
