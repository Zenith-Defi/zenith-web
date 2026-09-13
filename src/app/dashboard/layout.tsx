import Link from "next/link";
import { requireClient } from "@/lib/session";
import { logout } from "./actions";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", label: "Invoices" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/api-keys", label: "API keys" },
  { href: "/dashboard/webhooks", label: "Webhooks" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Redirects to /login when there is no valid session.
  const client = requireClient();
  let merchantName = "Merchant";
  try {
    merchantName = (await client.me()).name;
  } catch {
    // Leave the default; the page itself will surface a hard failure.
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-semibold">
            Zenith
          </Link>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{merchantName}</span>
          <form action={logout}>
            <Button variant="outline" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
