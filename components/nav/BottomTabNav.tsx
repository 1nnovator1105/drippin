"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import BottomTabHomeIcon from "../icon/BottomTabHomeIcon";
import BottomTabRecipeIcon from "../icon/BottomTabRecipeIcon";
import BottomTabLogIcon from "../icon/BottmTabLogIcon";
import BottomTabMyPageIcon from "../icon/BottmTabMyPageIcon";
import { cn } from "@/utils/cn";

const TABS = [
  {
    path: "/",
    label: "홈",
    Icon: BottomTabHomeIcon,
    match: (p: string) => p === "/",
  },
  {
    path: "/recipe",
    label: "레시피",
    Icon: BottomTabRecipeIcon,
    match: (p: string) => p.startsWith("/recipe"),
  },
  {
    path: "/log",
    label: "일지",
    Icon: BottomTabLogIcon,
    match: (p: string) => p.startsWith("/log"),
  },
  {
    path: "/my",
    label: "내정보",
    Icon: BottomTabMyPageIcon,
    match: (p: string) => p.startsWith("/my"),
  },
];

export default function BottomTabNav() {
  const pathname = usePathname();
  // 탭을 누른 즉시 그 탭을 활성으로 표시(이동 완료 전 피드백). 경로가 바뀌면 해제.
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    setPendingPath(null);
  }, [pathname]);

  const current = pendingPath ?? pathname;

  return (
    <div
      className="btm-nav max-w-xl mx-auto md:border-x-[1px] h-[68px]"
      style={{
        boxShadow: "0px 0px 5px 0px rgb(0,0,0,0.2)",
      }}
    >
      {TABS.map(({ path, label, Icon, match }) => {
        const active = match(current);
        const pending = pendingPath === path && pendingPath !== pathname;
        return (
          <Link
            key={path}
            href={path}
            prefetch
            onClick={() => setPendingPath(path)}
            className={cn(
              "transition-opacity",
              active ? "text-brand" : "text-gray-400",
              pending && "animate-pulse",
            )}
          >
            <Icon />
            <span className="btm-nav-label text-sm font-bold">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
