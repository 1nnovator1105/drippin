"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SearchIcon from "../icon/SearchIcon";
import RecipeCard from "../share/RecipeCard";
import LogCard from "./LogCard";
import { cn } from "@/utils/cn";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowDownIcon } from "lucide-react";

export default function HomeWrapper() {
  const supabase = useSupabaseBrowser();
  const [selectedTab, setSelectedTab] = useState<string>("레시피");
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  const feedQuery = useQuery({
    queryKey: ["drippin", "feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select(`*, profiles(handle, email)`)
        .order("created_at", { ascending: false });
      return data;
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between px-3 py-2 items-center max-h-[52px] sticky top-0 bg-white z-[99]">
        <div>
          <div
            role="tablist"
            className="tabs gap-[15px] tabs-bordered tabs-lg xs:tabs-sm"
          >
            <input
              type="radio"
              name="my_tabs"
              role="tab"
              className={cn(
                "tab max-h-[32px]",
                selectedTab === "레시피" ? "text-gray-900" : "text-gray-400",
              )}
              aria-label="레시피"
              style={{
                borderColor: selectedTab !== "레시피" ? "transparent" : "#000",
              }}
              checked={selectedTab === "레시피"}
              onChange={() => {
                setSelectedTab("레시피");
              }}
            />
            <input
              type="radio"
              name="my_tabs"
              role="tab"
              className={cn(
                "tab max-h-[32px]",
                selectedTab === "일지" ? "text-gray-900" : "text-gray-400",
              )}
              aria-label="일지"
              style={{
                borderColor: selectedTab !== "일지" ? "transparent" : "#000",
              }}
              checked={selectedTab === "일지"}
              onChange={() => {
                setSelectedTab("일지");
              }}
            />
          </div>
        </div>

        <div>
          <SearchIcon />
        </div>
      </div>

      <div className="w-full" ref={scrollRef}>
        {selectedTab === "레시피" && (
          <div id="slide1" className="relative w-full flex-col flex">
            {feedQuery.data?.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {selectedTab === "일지" && (
          <div id="slide2" className="relative w-full gap-3 flex-col flex">
            <LogCard />
            <LogCard />
            <LogCard />
            <LogCard />
          </div>
        )}
      </div>
    </div>
  );
}
