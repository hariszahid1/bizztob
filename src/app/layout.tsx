import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bizztob — B2B Ordering for Retailers & Distributors",
  description:
    "Bizztob connects local retail shops with their distributors. Place orders digitally, manage deliveries, and keep clean ledgers — all in one platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
