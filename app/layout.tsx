import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kahoot! - Create Fun Learning Games",
  description: "Create and play fun quiz games in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
