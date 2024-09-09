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
    <ReactQueryClientProvider>
      <html lang="en" className={GeistSans.className} suppressHydrationWarning>
        <body className="bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-end items-center p-3 px-5 text-sm">
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  <ThemeSwitcher />
                </div>
              </nav> */}
            <div className="flex max-w-3xl mx-auto flex-col md:border-x-[1px] h-full">
              <TopNav />

              <div className="flex flex-1 min-h-screen flex-col gap-20 p-5">
                {children}
              </div>

              <BottomTabNav />
            </div>

            <div id="modal-root"></div>
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
