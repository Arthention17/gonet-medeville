import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gonet-Médeville — Grands Vins de Bordeaux & Champagne",
  description: "Vignobles Gonet-Médeville. Producteurs de Grands Vins de Bordeaux et de Grands Crus en Champagne depuis 1710.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="grain">{children}</body>
    </html>
  );
}
