"use client";

import { pretendard } from "@/styles/fonts";
import BottomTabNav from "../nav/BottomTabNav";
import { useEffect } from "react";
import { init } from "@/utils/analytics";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface WrapperProps {
  children: React.ReactNode;
}

export default function Wrapper({ children }: WrapperProps) {
  const pathname = usePathname(); // 현재 경로 가져오기
  const hideBottomTabNav =
    pathname.startsWith("/recipe/") &&
    (pathname.includes("/timer") || pathname.includes("/onboarding")); // 수정된 부분

  useEffect(() => {
    init();
  }, []);

  return (
    <div
      className={`flex flex-col h-screen max-w-xl mx-auto bg-white md:shadow-[0_0_40px_rgba(0,0,0,0.06)] ${pretendard.variable} font-pretendard`}
    >
      <style jsx global>
        {`:root { --font-pretendard: ${pretendard.style.fontFamily};}}`}
      </style>
      <div
        className={cn(
          "flex-1 pb-[72px] border-x border-stone-200",
          hideBottomTabNav && "pb-0",
        )}
      >
        {children}
      </div>
      {!hideBottomTabNav && <BottomTabNav />}
    </div>
  );
}
