import { requireClient } from "@/lib/session";
import { formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateKeyForm } from "@/components/create-key-form";
import { revokeApiKey } from "../actions";

export const dynamic = "force-dynamic";

export default async function ApiKeysPage() {
  const { data: keys } = await requireClient().apiKeys.list();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>New API key</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateKeyForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API keys</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">Prefix</th>
                <th className="px-5 py-3 font-medium">Label</th>
                <th className="px-5 py-3 font-medium">Last used</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <code>{key.prefix}…</code>
                  </td>
                  <td className="px-5 py-3">{key.label ?? "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDateTime(key.lastUsedAt)}</td>
                  <td className="px-5 py-3">{key.revokedAt ? "Revoked" : "Active"}</td>
                  <td className="px-5 py-3 text-right">
                    {key.revokedAt ? null : (
                      <form action={revokeApiKey}>
                        <input type="hidden" name="id" value={key.id} />
                        <Button variant="destructive" size="sm" type="submit">
                          Revoke
                        </Button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
