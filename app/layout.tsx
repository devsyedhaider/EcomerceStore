/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DataInitializer from "@/components/DataInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura Feet | Premium Footwear Pakistan",
  description: "Shop the latest premium shoes for men, women, and kids. Experience comfort and style with Aura Feet Pakistan.",
  keywords: ["shoes", "footwear", "pakistan", "online shopping", "men shoes", "women shoes", "bata", "servis", "premium shoes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`} suppressHydrationWarning>
        <DataInitializer />
        {children}
      </body>
    </html>
  );
}
