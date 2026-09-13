"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, requireClient } from "@/lib/session";

export async function logout(): Promise<void> {
  clearSession();
  redirect("/login");
}

// Returns the plaintext once so the page can show it. It is never retrievable
// again; the API only stores the hash.
export async function createApiKey(_prev: unknown, formData: FormData): Promise<{ plaintext?: string; error?: string }> {
  const label = String(formData.get("label") ?? "").trim() || undefined;
  try {
    const key = await requireClient().apiKeys.create({ label });
    revalidatePath("/dashboard/api-keys");
    return { plaintext: key.plaintext };
  } catch {
    return { error: "Could not create the key." };
  }
}

// Convenience for the dashboard: create an invoice from a display amount and an
// asset code. The display amount is converted to integer stroops here without a
// float, matching the API's money rule.
export async function createInvoice(_prev: unknown, formData: FormData): Promise<{ id?: string; error?: string }> {
  const amount = String(formData.get("amount") ?? "").trim();
  const assetCode = String(formData.get("assetCode") ?? "XLM").trim();
  const issuer = String(formData.get("issuer") ?? "").trim() || null;
  const memo = String(formData.get("memo") ?? "").trim() || undefined;

  const match = /^(\d+)(?:\.(\d{1,7}))?$/.exec(amount);
  if (!match) return { error: "Amount must be a decimal with up to seven places." };
  const whole = BigInt(match[1] ?? "0");
  const frac = (match[2] ?? "").padEnd(7, "0");
  const stroops = (whole * 10_000_000n + BigInt(frac || "0")).toString();

  try {
    const invoice = await requireClient().invoices.create({
      amount: stroops,
      asset: { code: assetCode, issuer },
      memo,
    });
    revalidatePath("/dashboard");
    return { id: invoice.id };
  } catch {
    return { error: "Could not create the invoice." };
  }
}

export async function cancelInvoice(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await requireClient().invoices.cancel(id);
  revalidatePath(`/dashboard/invoices/${id}`);
  revalidatePath("/dashboard");
}

export async function revokeApiKey(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await requireClient().apiKeys.revoke(id);
  revalidatePath("/dashboard/api-keys");
}

export async function createEndpoint(_prev: unknown, formData: FormData): Promise<{ secret?: string; error?: string }> {
  const url = String(formData.get("url") ?? "").trim();
  const eventsRaw = String(formData.get("events") ?? "").trim();
  const events = eventsRaw ? eventsRaw.split(",").map((e) => e.trim()).filter(Boolean) : undefined;
  if (!url) return { error: "Enter a URL." };
  try {
    const endpoint = await requireClient().webhookEndpoints.create({ url, events });
    revalidatePath("/dashboard/webhooks");
    return { secret: endpoint.secret };
  } catch {
    return { error: "Could not create the endpoint." };
  }
}

export async function deleteEndpoint(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await requireClient().webhookEndpoints.delete(id);
  revalidatePath("/dashboard/webhooks");
}

export async function replayDelivery(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await requireClient().webhookEndpoints.replay(id);
  revalidatePath("/dashboard/webhooks");
}
