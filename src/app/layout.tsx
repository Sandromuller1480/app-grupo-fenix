import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grupo Fenix | Plataforma Demonstrativa",
  description: "Prototipo navegavel para compras e CRM interno do Grupo Fenix.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/logos/fenix.jpeg", type: "image/jpeg" }],
    shortcut: "/logos/fenix.jpeg",
    apple: [{ url: "/logos/fenix.jpeg", type: "image/jpeg" }],
  },
  appleWebApp: {
    title: "Grupo Fenix",
    capable: true,
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
