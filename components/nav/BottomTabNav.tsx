"use client";

import { fetchMySelf } from "@/queries/user";
import { Database } from "@/types/database.types";
import useSupabaseBrowser from "@/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomTabHomeIcon from "../icon/BottomTabHomeIcon";
import BottomTabRecipeIcon from "../icon/BottomTabRecipeIcon";
import BottomTabLogIcon from "../icon/BottmTabLogIcon";
import BottomTabMyPageIcon from "../icon/BottmTabMyPageIcon";
import { cn } from "@/utils/cn";
import { useQuery } from "@tanstack/react-query";

export default function BottomTabNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useSupabaseBrowser();

  const mySessionQuery = useQuery({
    queryKey: ["drippin", "mySession"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    },
  });

  const myProfileQuery = useQuery({
    queryKey: ["drippin", "myProfile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", mySessionQuery.data?.session?.user.id!)
        .throwOnError()
        .single();
      return data;
    },
    enabled: !!mySessionQuery.data?.session?.user.id,
  });

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
            pathname === "/recipe" ? "text-gray-900" : "text-gray-400",
          )}
        >
          레시피
        </span>
      </button>
      <button
        // className={isMyPage ? "active" : ""}
        onClick={() => route(`/${myProfileQuery.data?.handle}`)}
      >
        <BottomTabLogIcon />
        <span
          className={cn(
            "btm-nav-label",
            pathname === `/${myProfileQuery.data?.handle}`
              ? "text-gray-900"
              : "text-gray-400",
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
            pathname === "/my" ? "text-gray-900" : "text-gray-400",
          )}
        >
          내정보
        </span>
      </button>
    </div>
  );
}
