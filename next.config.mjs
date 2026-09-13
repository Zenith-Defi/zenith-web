/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The SDK ships as source-built ESM from a git dependency; let Next transpile it.
  transpilePackages: ["@zenithpay/sdk"],
};

export default nextConfig;
