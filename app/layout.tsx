import DeployButton from "@/components/shared/deploy-button";
import { EnvVarWarning } from "@/components/shared/env-var-warning";
import HeaderAuth from "@/components/shared/header-auth";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Poker Tracker",
  description: "Poker Analytics for the Average Player",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
