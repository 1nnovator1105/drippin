import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
import Wrapper from "@/components/share/Wrapper";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Drippin - 드립커피 커뮤니티",
  description: "드립커피 커뮤니티 Drippin에서 이야기를 나눠보세요.",
  openGraph: {
    images: [
      {
        url: "../public/assets/images/thumbnail.jpeg", // 썸네일 이미지 URL
        width: 1200, // 이미지 너비
        height: 630, // 이미지 높이
      },
    ],
  },
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
      </body>
    </html>
  );
}
