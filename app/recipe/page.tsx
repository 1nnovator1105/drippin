"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import KakaoButton from "../auth/callback/kakao-button";
import RecipeCard from "@/components/share/RecipeCard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginNudge from "@/components/auth/LoginNudge";
import Spinner from "@/components/share/Spinner";
import Header from "@/components/share/Header";

export default function RecipePage() {
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const mySessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    },
  });

  const myRecipeQuery = useQuery({
    queryKey: ["drippin", "recipes", "my"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select(`*, profiles(handle, email), likes:recipes_likes(*)`)
        .eq("user_id", mySessionQuery.data?.session?.user.id!)
        .order("created_at", { ascending: false });

      return data;
    },
    enabled: !!mySessionQuery.data?.session?.user.id,
  });

  const preventClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    e.preventDefault();
    router.push("/recipe/add");
  };

  if (mySessionQuery.isLoading || myRecipeQuery.isLoading) return <Spinner />;

  if (!mySessionQuery.data?.session) return <LoginNudge />;

  return (
    <div className="pb-[88px] flex flex-col justify-center items-center">
      <Header title="레시피" />

      <div className="flex flex-col w-full">
        {myRecipeQuery.data?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} summary />
        ))}
      </div>

      {mySessionQuery.data?.session?.user.id && !myRecipeQuery.isLoading && (
        <Link
          href="/recipe/add"
          className="fixed bottom-[88px] flex py-[10px] px-[20px] bg-black rounded-3xl text-white self-center"
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
