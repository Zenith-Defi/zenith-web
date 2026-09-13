const STROOPS_PER_UNIT = 10_000_000n;

// Amounts arrive as integer stroop strings. Format for display without ever
// building a float: split off the fractional part with bigint arithmetic and
// trim trailing zeros for readability.
export function formatStroops(stroops: string): string {
  const value = BigInt(stroops);
  const whole = value / STROOPS_PER_UNIT;
  const frac = (value % STROOPS_PER_UNIT).toString().padStart(7, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}

export function formatAmount(stroops: string, assetCode: string): string {
  return `${formatStroops(stroops)} ${assetCode}`;
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export function truncateMiddle(value: string, keep = 6): string {
  if (value.length <= keep * 2 + 1) return value;
  return `${value.slice(0, keep)}…${value.slice(-keep)}`;
}
