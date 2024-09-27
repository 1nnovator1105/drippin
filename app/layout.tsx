import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
import { Suspense } from "react";
import ClientSideScrollRestorer from "./ClientSideScrollRestorer";
import Wrapper from "@/components/share/Wrapper";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Drippin - 드립커피 커뮤니티",
  description: "드립커피 커뮤니티 Drippin에서 이야기를 나눠보세요.",
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
