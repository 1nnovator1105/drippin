"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import FetchMore from "@/components/share/FetchMore";
import KakaoButton from "../auth/callback/kakao-button";
import RecipeCard from "@/components/share/RecipeCard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginNudge from "@/components/auth/LoginNudge";
import Spinner from "@/components/share/Spinner";
import Header from "@/components/share/Header";
import { logEvent } from "@/utils/analytics";
import events from "@/utils/events";
import { queryKeys } from "@/queries/queryKeys";
import { fetchSession } from "@/queries/session";
import { fetchMyRecipe } from "@/queries/recipe";

export default function Recipe() {
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const mySessionQuery = useQuery({
    queryKey: queryKeys.session(),
    queryFn: () => fetchSession(supabase),
  });

  const myRecipeQuery = useInfiniteQuery({
    queryKey: queryKeys.myRecipe(),
    queryFn: ({ pageParam }) =>
      fetchMyRecipe(supabase, mySessionQuery.data?.session?.user.id!, pageParam),
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

  if (mySessionQuery.isLoading || myRecipeQuery.isLoading) return <Spinner />;

  if (!mySessionQuery.data?.session) return <LoginNudge />;

  return (
    <div className="pb-[88px] flex flex-col justify-center items-center">
      <Header title="레시피" />

      <div className="flex flex-col w-full">
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
      </div>

      {!myRecipeQuery.data?.pages?.[0]?.length && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
          아직 작성된 레시피가 없어요
          <br />
          레시피를 만들어서 공유해보세요!
        </div>
      )}

      {mySessionQuery.data?.session?.user.id && !myRecipeQuery.isLoading && (
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
