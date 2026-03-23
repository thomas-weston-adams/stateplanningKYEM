import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KYEM County Planning Dashboard",
  description:
    "Kentucky Emergency Management – County Planning Status, Documents Repository, and Official Directory",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
