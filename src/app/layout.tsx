import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gonet-Medeville — Grands Vins de Bordeaux & Champagne",
  description: "Vignobles Gonet-Medeville. Depuis 1710.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="grain">{children}</body>
    </html>
  );
}
