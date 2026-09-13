import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  open: "bg-muted text-muted-foreground",
  paid: "bg-success/15 text-success",
  overpaid: "bg-success/15 text-success",
  underpaid: "bg-warning/15 text-warning",
  expired: "bg-muted text-muted-foreground",
  cancelled: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}
