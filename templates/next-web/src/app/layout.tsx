import type { Metadata } from "next";
import "./globals.css";
import { env } from "@/config/env";

export const metadata: Metadata = {
  title: env.appName,
  description: "A production-ready Next.js template for Pytholit projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
