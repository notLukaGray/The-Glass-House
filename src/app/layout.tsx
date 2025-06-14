import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "portfolio - luka gray",
  description: "portfolio website",
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
