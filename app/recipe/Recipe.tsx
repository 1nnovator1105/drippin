"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import FetchMore from "@/components/share/FetchMore";
import RecipeCard from "@/components/share/RecipeCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginNudge from "@/components/auth/LoginNudge";
import Spinner from "@/components/share/Spinner";
import Header from "@/components/share/Header";
import { logEvent } from "@/utils/analytics";
import events from "@/utils/events";
import { queryKeys } from "@/queries/queryKeys";
import { fetchMyRecipe } from "@/queries/recipe";
import useSession from "@/hooks/useSession";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/utils/cn";
import { Search } from "lucide-react";

type Temperature = "all" | "ice" | "hot";

export default function Recipe() {
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [temperature, setTemperature] = useState<Temperature>("all");
  const debouncedKeyword = useDebounce(keyword, 300);

  const mySessionQuery = useSession();

  const myRecipeQuery = useInfiniteQuery({
    queryKey: [...queryKeys.myRecipe(), debouncedKeyword, temperature],
    queryFn: ({ pageParam }) =>
      fetchMyRecipe(
        supabase,
        mySessionQuery.data?.session?.user.id!,
        pageParam,
        debouncedKeyword,
        temperature,
      ),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length : undefined,
    initialPageParam: 0,
    enabled: !!mySessionQuery.data?.session?.user.id,
  });

  const preventClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    e.preventDefault();
    logEvent(events.clickAddRecipe);
    router.push("/recipe/add");
  };

  if (mySessionQuery.isLoading) return <Spinner />;

  if (!mySessionQuery.data?.session) return <LoginNudge />;

  const hasResults = !!myRecipeQuery.data?.pages?.[0]?.length;
  const isSearching = debouncedKeyword.trim() !== "" || temperature !== "all";

  return (
    <div className="pb-[88px] flex flex-col items-center">
      <Header title="레시피" />

      <div className="w-full flex flex-col gap-2 px-3 pt-2 pb-3 border-b border-stone-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="레시피 이름·설명 검색"
            aria-label="레시피 검색"
            type="search"
            className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-brand"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "ice", "hot"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTemperature(t)}
              className={cn(
                "px-3 py-1 rounded-full text-sm border",
                temperature === t
                  ? "bg-brand text-brand-foreground border-brand"
                  : "bg-white text-stone-500 border-stone-200",
              )}
            >
              {t === "all" ? "전체" : t === "ice" ? "ICE" : "HOT"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full">
        {myRecipeQuery.isPending ? (
          <Spinner />
        ) : (
          <>
            {myRecipeQuery.data?.pages.map((recipes) =>
              recipes?.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} summary />
              )),
            )}
            <FetchMore
              fetchNextPage={myRecipeQuery.fetchNextPage}
              hasNextPage={myRecipeQuery.hasNextPage}
              isError={myRecipeQuery.isError}
            />
          </>
        )}
      </div>

      {!myRecipeQuery.isPending && !hasResults && (
        <div className="mt-20 w-full text-center text-stone-500">
          {isSearching ? (
            "검색 결과가 없어요"
          ) : (
            <>
              아직 작성된 레시피가 없어요
              <br />
              레시피를 만들어서 공유해보세요!
            </>
          )}
        </div>
      )}

      {mySessionQuery.data?.session?.user.id && (
        <Link
          href="/recipe/add"
          className="fixed bottom-[88px] flex py-[10px] px-[20px] bg-brand rounded-3xl text-brand-foreground self-center"
          onClick={preventClick}
          style={{
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          새로운 레시피 작성하기
        </Link>
      )}
    </div>
  );
}
