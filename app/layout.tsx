import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ThemeSwitcher } from "@/components/theme-switcher";
import TopNav from "@/components/nav/TopNav";
import BottomTabNav from "@/components/nav/BottomTabNav";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
import { Suspense } from "react";
import ClientSideScrollRestorer from "./ClientSideScrollRestorer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ReactQueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col h-screen max-w-xl mx-auto border-x-[1px]">
              <div className="flex-1 overflow-y-auto pb-[98px]">{children}</div>
              <BottomTabNav />
            </div>

            <div id="modal-root"></div>
          </ThemeProvider>
        </ReactQueryClientProvider>
        <Suspense>
          <ClientSideScrollRestorer />
        </Suspense>
      </body>
    </html>
  );
}
