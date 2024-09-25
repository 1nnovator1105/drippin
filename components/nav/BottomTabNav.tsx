"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import BottomTabHomeIcon from "../icon/BottomTabHomeIcon";
import BottomTabRecipeIcon from "../icon/BottomTabRecipeIcon";
import BottomTabLogIcon from "../icon/BottmTabLogIcon";
import BottomTabMyPageIcon from "../icon/BottmTabMyPageIcon";
import { cn } from "@/utils/cn";

export default function BottomTabNav() {
  const pathname = usePathname();
  const router = useRouter();

  const route = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className="btm-nav max-w-xl mx-auto md:border-x-[1px] h-[68px]"
      style={{
        boxShadow: "0px 0px 5px 0px rgb(0,0,0,0.2)",
      }}
    >
      <button
        // className={pathname === "/" ? "active" : ""}
        onClick={() => route("/")}
      >
        <BottomTabHomeIcon />
        <span
          className={cn(
            "btm-nav-label",
            pathname === "/" ? "text-gray-900" : "text-gray-400",
          )}
        >
          홈
        </span>
      </button>
      <button
        // className={pathname === "/notes" ? "active" : ""}
        onClick={() => route("/recipe")}
      >
        <BottomTabRecipeIcon />
        <span
          className={cn(
            "btm-nav-label",
            pathname.includes("/recipe") ? "text-gray-900" : "text-gray-400",
          )}
        >
          레시피
        </span>
      </button>
      <button
        // className={isMyPage ? "active" : ""}
        onClick={() => route(`/log`)}
      >
        <BottomTabLogIcon />
        <span
          className={cn(
            "btm-nav-label",
            pathname.includes("/log") ? "text-gray-900" : "text-gray-400",
          )}
        >
          일지
        </span>
      </button>
      <button
        // className={isMyPage ? "active" : ""}
        onClick={() => route(`/my`)}
      >
        <BottomTabMyPageIcon />
        <span
          className={cn(
            "btm-nav-label",
            pathname.includes("/my") ? "text-gray-900" : "text-gray-400",
          )}
        >
          내정보
        </span>
      </button>
    </div>
  );
}
