import localFont from "next/font/local";

export const pretendard = localFont({
  src: "../public/assets/fonts/PretendardVariable.woff2",
  display: "swap",
  style: "normal",
  weight: "45 920",
  preload: true,
  variable: "--font-pretendard",
});
