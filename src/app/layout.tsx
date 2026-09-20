import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omni Cart | Premium Dropshipping Store",
  description: "Curated products, sourced globally, delivered fast across the UK and USA."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
