import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GapSnap | Prediction Market Arbitrage",
  description: "Advanced trading dashboard for prediction market arbitrage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
