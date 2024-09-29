import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
import Wrapper from "@/components/share/Wrapper";
import { Analytics } from "@vercel/analytics/react";
import { Viewport } from "next";

const defaultUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Drippin - 드립커피 커뮤니티",
  description: "드립커피 커뮤니티 Drippin에서 이야기를 나눠보세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Wrapper>{children}</Wrapper>
          </ThemeProvider>
        </ReactQueryClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
