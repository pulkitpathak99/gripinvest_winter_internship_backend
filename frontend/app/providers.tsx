import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // <- client-only wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grip Invest Platform",
  description: "Mini Investment Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
