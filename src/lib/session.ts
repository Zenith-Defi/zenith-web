import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Zenith } from "@zenithpay/sdk";
import { apiUrl } from "./env";

const COOKIE = "zenith_session";

// The session is the merchant's API key, held in an httpOnly cookie. There is no
// separate password store: proving you hold a working key is the login. The key
// never reaches the browser after login because every dashboard call runs on the
// server. Zenith holds no Stellar secret; this key is the only credential.
export async function setSession(apiKey: string): Promise<void> {
  cookies().set(COOKIE, apiKey, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSession(): void {
  cookies().delete(COOKIE);
}

export function getApiKey(): string | null {
  return cookies().get(COOKIE)?.value ?? null;
}

// Returns a server-side SDK client bound to the session key, or redirects to the
// login page when there is no session.
export function requireClient(): Zenith {
  const apiKey = getApiKey();
  if (!apiKey) redirect("/login");
  return new Zenith({ apiKey, baseUrl: apiUrl });
}

// Validate a key by making one authenticated call. Used at login.
export async function validateKey(apiKey: string): Promise<boolean> {
  const client = new Zenith({ apiKey, baseUrl: apiUrl });
  try {
    await client.invoices.list({ limit: 1 });
    return true;
  } catch {
    return false;
  }
}
