import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import Providers from "@/providers/react.query";
import { CounterStoreProvider } from "@/providers/zustand-store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "vybesync",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${geistSans.variable}  ${geistMono.variable} antialiased`}>
          <CounterStoreProvider>
            <Providers>{children}</Providers>
          </CounterStoreProvider>
        <Toaster richColors/>
      </body>
    </html>
  );
}
