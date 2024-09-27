"use client";

import { useEffect, useRef, useState } from "react";
import RecipeCard from "../share/RecipeCard";
import LogCard from "./LogCard";
import { cn } from "@/utils/cn";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function HomeWrapper() {
  const supabase = useSupabaseBrowser();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<string>(
    searchParams.get("tab") || "레시피",
  );

  const recipeFeedQuery = useQuery({
    queryKey: ["drippin", "feed", "recipe"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select(`*, profiles(handle, email), likes:recipes_likes(*)`)
        .order("created_at", { ascending: false });

      return data;
    },
  });

  const logFeedQuery = useQuery({
    queryKey: ["drippin", "feed", "log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("logs")
        .select(`*, profiles(handle, email), likes:logs_likes(*)`)
        .order("created_at", { ascending: false });

      return data;
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", selectedTab);
    setSelectedTab(params.get("tab") || "레시피");
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`,
    );
  }, [selectedTab]);

  return (
    <div className="flex flex-col pb-[88px]">
      <div className="flex flex-row justify-between pt-2 items-center sticky top-0 bg-white z-[99]">
        <div className="w-full">
          <div role="tablist" className="tabs tabs-bordered tabs-lg xs:tabs-sm">
            <input
              type="radio"
              name="my_tabs"
              role="tab"
              className={cn(
                "tab text-xl border-b-transparent",
                selectedTab === "레시피" ? "text-gray-900" : "text-gray-400",
              )}
              aria-label="레시피"
              style={{
                borderColor: selectedTab !== "레시피" ? "border-gray-400" : "",
              }}
              defaultChecked={selectedTab === "레시피"}
              onChange={() => {
                setSelectedTab("레시피");
              }}
            />
            <input
              type="radio"
              name="my_tabs"
              role="tab"
              className={cn(
                "tab text-xl",
                selectedTab === "일지" ? "text-gray-900" : "text-gray-400",
              )}
              aria-label="일지"
              style={{
                borderColor: selectedTab !== "일지" ? "border-gray-400" : "",
              }}
              defaultChecked={selectedTab === "일지"}
              onChange={() => {
                setSelectedTab("일지");
              }}
            />
          </div>
        </div>

        {/* <div>
          <SearchIcon />
        </div> */}
      </div>

      <div className="w-full">
        {selectedTab === "레시피" && (
          <div id="slide1" className="relative w-full flex-col flex">
            {recipeFeedQuery.data?.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {selectedTab === "일지" && (
          <div id="slide2" className="relative w-full flex-col flex">
            {logFeedQuery.data?.map((log) => (
              <LogCard key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
