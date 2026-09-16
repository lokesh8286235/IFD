import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IFD — India Food Delivery",
  description: "AI-powered food discovery, price comparison, and ordering.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
