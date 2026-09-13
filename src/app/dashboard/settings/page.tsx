import { requireClient } from "@/lib/session";
import { formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const merchant = await requireClient().me();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <Row label="Merchant name" value={merchant.name} />
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Stellar account</span>
          <span className="flex items-center gap-2">
            <code className="break-all">{merchant.stellarAccount}</code>
            <CopyButton value={merchant.stellarAccount} label="" />
          </span>
        </div>
        <Row label="Default payment mode" value={merchant.defaultMode} />
        <Row label="Created" value={formatDateTime(merchant.createdAt)} />
        <p className="text-muted-foreground">
          Funds settle directly to this account. Zenith holds no key for it and never takes custody.
          Editing merchant profile and configuring an anchor for fiat settlement are on the roadmap; see
          ISSUES.md.
        </p>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="capitalize">{value}</span>
    </div>
  );
}
