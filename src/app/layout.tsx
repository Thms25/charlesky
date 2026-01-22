import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Charlesky | Music Producer & Mixing Engineer",
  description: "Portfolio of Charlesky, a music producer and mixing engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        <Suspense fallback={<div>Loading...</div>}> <Navbar /> </Suspense>
        <main className="grow pt-24 px-6 md:px-12">
          {children}
        </main>
        <Suspense fallback={<div>Loading...</div>}> <Footer /> </Suspense>
      </body>
    </html>
  );
}
