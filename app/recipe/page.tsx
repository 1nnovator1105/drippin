"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import KakaoButton from "../auth/callback/kakao-button";
import RecipeCard from "@/components/share/RecipeCard";

export default function RecipePage() {
  const supabase = useSupabaseBrowser();

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
        .select(`*, profiles(handle, email)`)
        .eq("user_id", mySessionQuery.data?.session?.user.id!)
        .order("created_at", { ascending: false });
      return data;
    },
    enabled: !!mySessionQuery.data?.session?.user.id,
  });

  if (mySessionQuery.isLoading) return <div>Loading...</div>;

  return (
    <div>
      {mySessionQuery.data?.session?.user.id ? (
        <Link href="/recipe/add" className="flex self-end justify-end my-3">
          <button className="btn btn-primary">레시피 추가</button>
        </Link>
      ) : (
        <KakaoButton />
      )}

      <div className="flex flex-col mt-4">
        {myRecipeQuery.data?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} summary />
        ))}
      </div>
    </div>
  );
}
