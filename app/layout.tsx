import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import BottomTabNav from "@/components/nav/BottomTabNav";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
import { Suspense } from "react";
import ClientSideScrollRestorer from "./ClientSideScrollRestorer";
import { pretendard } from "@/styles/fonts";
import Wrapper from "@/components/share/Wrapper";

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
            <Wrapper>{children}</Wrapper>
          </ThemeProvider>
        </ReactQueryClientProvider>
        <Suspense>
          <ClientSideScrollRestorer />
        </Suspense>
      </body>
    </html>
  );
}
