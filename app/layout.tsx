/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import "./globals.css";
import DataInitializer from "@/components/DataInitializer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lato = Lato({ 
  subsets: ["latin"], 
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato" 
});

export const metadata: Metadata = {
  title: "THE AURIC VAULT | Fine Collections",
  description: "Exquisite designs and handcrafted elegance at THE AURIC VAULT.",
  keywords: ["jewelry", "luxury", "fine collections", "the auric vault"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${lato.variable} font-lato min-h-screen flex flex-col transition-all duration-300`} suppressHydrationWarning>
        <DataInitializer />
        {children}
      </body>
    </html>
  );
}
