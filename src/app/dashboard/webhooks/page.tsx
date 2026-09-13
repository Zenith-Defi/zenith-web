import type { WebhookDelivery, WebhookEndpoint } from "@zenithpay/sdk";
import { requireClient } from "@/lib/session";
import { formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateEndpointForm } from "@/components/create-endpoint-form";
import { deleteEndpoint, replayDelivery } from "../actions";

export const dynamic = "force-dynamic";

export default async function WebhooksPage() {
  const client = requireClient();
  const { data: endpoints } = await client.webhookEndpoints.list();

  // Fetch each endpoint's recent delivery log in parallel.
  const logs = await Promise.all(
    endpoints.map(async (endpoint) => {
      try {
        const { data } = await client.webhookEndpoints.deliveries(endpoint.id, { limit: 10 });
        return { endpoint, deliveries: data };
      } catch {
        return { endpoint, deliveries: [] as WebhookDelivery[] };
      }
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add a webhook endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateEndpointForm />
        </CardContent>
      </Card>

      {endpoints.length === 0 ? (
        <Card>
          <CardContent className="text-sm text-muted-foreground">No endpoints yet.</CardContent>
        </Card>
      ) : (
        logs.map(({ endpoint, deliveries }) => (
          <EndpointCard key={endpoint.id} endpoint={endpoint} deliveries={deliveries} />
        ))
      )}
    </div>
  );
}

function EndpointCard({ endpoint, deliveries }: { endpoint: WebhookEndpoint; deliveries: WebhookDelivery[] }) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base">{endpoint.url}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {endpoint.events.length ? endpoint.events.join(", ") : "all events"}
          </p>
        </div>
        <form action={deleteEndpoint}>
          <input type="hidden" name="id" value={endpoint.id} />
          <Button variant="outline" size="sm" type="submit">
            Delete
          </Button>
        </form>
      </CardHeader>
      <CardContent className="p-0">
        {deliveries.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No deliveries yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Attempts</th>
                <th className="px-5 py-3 font-medium">Response</th>
                <th className="px-5 py-3 font-medium">Last attempt</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">{d.eventType}</td>
                  <td className="px-5 py-3 capitalize">{d.status}</td>
                  <td className="px-5 py-3">{d.attempts}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.lastResponseStatus ?? "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDateTime(d.lastAttemptAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <form action={replayDelivery}>
                      <input type="hidden" name="id" value={d.id} />
                      <Button variant="ghost" size="sm" type="submit">
                        Replay
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
