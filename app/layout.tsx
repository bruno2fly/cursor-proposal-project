import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggleFloating from "@/components/ThemeToggleFloating";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "2FLY Marketing - Proposals",
  description: "Interactive marketing proposals by 2FLY Marketing Agency",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body className={`${dmSans.className} antialiased`}>
        <ThemeProvider>
          {children}
          <ThemeToggleFloating />
        </ThemeProvider>
      </body>
    </html>
  );
}
