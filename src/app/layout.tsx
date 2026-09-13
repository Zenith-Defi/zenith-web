import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenith",
  description: "Non-custodial crypto checkout on Stellar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
