import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gonet-Médeville — Grands Vins de Bordeaux & Champagne",
  description: "Vignobles Gonet-Médeville. Depuis 1710.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="grain">{children}</body>
    </html>
  );
}
