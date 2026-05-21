"use client";

import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useSupabaseBrowser from "@/utils/supabase/client";
import { fetchProfileByHandle } from "@/queries/profile";
import { fetchMyRecipe } from "@/queries/recipe";
import { fetchMyLog } from "@/queries/log";
import RecipeCard from "@/components/share/RecipeCard";
import LogCard from "@/components/share/LogCard";
import FetchMore from "@/components/share/FetchMore";
import Spinner from "@/components/share/Spinner";
import { ChevronLeft, User } from "lucide-react";
import { cn } from "@/utils/cn";

export default function ProfileHome({ handle }: { handle: string }) {
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"레시피" | "일지">("레시피");

  const profileQuery = useQuery({
    queryKey: ["drippin", "profile", handle],
    queryFn: () => fetchProfileByHandle(supabase, handle),
  });

  const userId = profileQuery.data?.id;

  const recipeQuery = useInfiniteQuery({
    queryKey: ["drippin", "profile", handle, "recipe"],
    queryFn: ({ pageParam }) => fetchMyRecipe(supabase, userId!, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length : undefined,
    initialPageParam: 0,
    enabled: !!userId,
  });

  const logQuery = useInfiniteQuery({
    queryKey: ["drippin", "profile", handle, "log"],
    queryFn: ({ pageParam }) => fetchMyLog(supabase, userId!, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length : undefined,
    initialPageParam: 0,
    enabled: !!userId,
  });

  if (profileQuery.isLoading) return <Spinner />;

  const profile = profileQuery.data;
  if (!profile) {
    return (
      <div className="mt-20 text-center text-stone-500">
        존재하지 않는 사용자예요
      </div>
    );
  }

  const isRecipe = selectedTab === "레시피";

  return (
    <div className="flex flex-col pb-[88px]">
      {/* 프로필 헤더 */}
      <div className="border-b border-stone-200 bg-brand-soft px-4 pb-4 pt-2">
        <button
          aria-label="뒤로"
          onClick={() => router.back()}
          className="-ml-1.5 mb-1 flex size-8 items-center justify-center text-brand"
        >
          <ChevronLeft className="size-6" />
        </button>
        <div className="flex items-center gap-1.5">
          <User className="size-5 text-brand" strokeWidth={2.5} />
          <h1 className="text-xl font-bold tracking-tight text-brand">
            @{profile.handle}
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          레시피 {profile.recipeCount} · 일지 {profile.logCount}
        </p>
      </div>

      {/* 탭 */}
      <div className="sticky top-0 z-[40] flex w-full bg-white">
        <div role="tablist" className="tabs tabs-bordered w-full">
          <input
            type="radio"
            name="profile_tabs"
            role="tab"
            aria-label="레시피"
            className={cn(
              "tab text-lg font-bold border-b-transparent",
              isRecipe ? "text-brand" : "text-gray-400",
            )}
            style={isRecipe ? { borderBottomColor: "hsl(var(--brand))" } : undefined}
            checked={isRecipe}
            onChange={() => setSelectedTab("레시피")}
          />
          <input
            type="radio"
            name="profile_tabs"
            role="tab"
            aria-label="일지"
            className={cn(
              "tab text-lg font-bold",
              !isRecipe ? "text-brand" : "text-gray-400",
            )}
            style={!isRecipe ? { borderBottomColor: "hsl(var(--brand))" } : undefined}
            checked={!isRecipe}
            onChange={() => setSelectedTab("일지")}
          />
        </div>
      </div>

      <div className="w-full">
        {isRecipe ? (
          <>
            {recipeQuery.data?.pages.map((recipes) =>
              recipes?.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} summary />
              )),
            )}
            <FetchMore
              fetchNextPage={recipeQuery.fetchNextPage}
              hasNextPage={recipeQuery.hasNextPage}
              isError={recipeQuery.isError}
            />
            {!recipeQuery.isPending &&
              !recipeQuery.data?.pages?.[0]?.length && (
                <div className="mt-16 text-center text-stone-500">
                  아직 작성한 레시피가 없어요
                </div>
              )}
          </>
        ) : (
          <>
            {logQuery.data?.pages.map((logs) =>
              logs?.map((log) => <LogCard key={log.id} log={log} summary />),
            )}
            <FetchMore
              fetchNextPage={logQuery.fetchNextPage}
              hasNextPage={logQuery.hasNextPage}
              isError={logQuery.isError}
            />
            {!logQuery.isPending && !logQuery.data?.pages?.[0]?.length && (
              <div className="mt-16 text-center text-stone-500">
                아직 작성한 일지가 없어요
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
