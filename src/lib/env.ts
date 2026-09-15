// Server-side base URL for the API. The SDK uses this for all dashboard calls.
export const apiUrl = process.env.ZENITH_API_URL ?? "http://localhost:8787";

// The checkout page passes this to the browser as a prop. It is read from the
// server-side ZENITH_API_URL at request time, not NEXT_PUBLIC_*, so the API URL
// is not baked into the client bundle at build time and can change without a
// rebuild. The deployed API is public, so the browser and the server use the
// same URL.
export const publicApiUrl = process.env.ZENITH_API_URL ?? "http://localhost:8787";

// This app's own base URL, used server-side to build checkout links.
export const checkoutBaseUrl =
  process.env.CHECKOUT_BASE_URL ?? process.env.NEXT_PUBLIC_CHECKOUT_BASE_URL ?? "http://localhost:3000";
