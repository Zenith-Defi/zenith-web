"use server";

import { redirect } from "next/navigation";
import { setSession, validateKey } from "@/lib/session";

export async function login(_prev: string | undefined, formData: FormData): Promise<string | undefined> {
  const apiKey = String(formData.get("apiKey") ?? "").trim();
  if (!apiKey) return "Enter an API key.";
  const ok = await validateKey(apiKey);
  if (!ok) return "That key was rejected by the API. Check it and that the API is reachable.";
  await setSession(apiKey);
  redirect("/dashboard");
}
