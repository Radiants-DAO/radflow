import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DevToolsProvider } from "@/devtools";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RadTools Demo",
  description: "Development tools for Next.js + Tailwind v4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DevToolsProvider>
          {children}
        </DevToolsProvider>
      </body>
    </html>
  );
}
