import type { Metadata } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

/*
 * Tipografia do brand book ORDO: Bodoni 72 (marca e títulos) + Avenir Next
 * (interface). Ambas são fontes licenciadas de sistema; o próprio brand book
 * define os equivalentes digitais — Bodoni Moda + Inter — que é o que usamos
 * aqui para não redistribuir fonte sem licença.
 */
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ORDO",
    template: "%s · ORDO",
  },
  description:
    "ORDO — ordem que gera direção. Gestão de relacionamento e pipeline comercial.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${bodoni.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
