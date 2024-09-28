"use client";

import { pretendard } from "@/styles/fonts";
import BottomTabNav from "../nav/BottomTabNav";
import { useEffect } from "react";
import { init } from "@/utils/analytics";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    init();
  }, []);

  return (
    <div
      className={`flex flex-col h-screen max-w-xl mx-auto ${pretendard.variable} font-pretendard`}
    >
      <style jsx global>
        {`:root { --font-pretendard: ${pretendard.style.fontFamily};}}`}
      </style>
      <div className="flex-1 pb-[72px] border-x-[1px]">{children}</div>
      <BottomTabNav />
    </div>
  );
}
