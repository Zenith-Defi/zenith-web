// Server-side base URL for the API. The SDK uses this for all dashboard calls.
export const apiUrl = process.env.ZENITH_API_URL ?? "http://localhost:8787";

// Browser-visible values. Next inlines NEXT_PUBLIC_* at build time.
export const publicApiUrl = process.env.NEXT_PUBLIC_ZENITH_API_URL ?? "http://localhost:8787";
export const checkoutBaseUrl = process.env.NEXT_PUBLIC_CHECKOUT_BASE_URL ?? "http://localhost:3000";
