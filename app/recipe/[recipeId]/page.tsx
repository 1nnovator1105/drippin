"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

// recipe/[recipeId]
export default function RecipePage() {
  const { recipeId } = useParams();
  const supabase = useSupabaseBrowser();

  const recipeQuery = useQuery({
    queryKey: ["drippin", "recipe", recipeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*, profiles(handle, email)")
        .eq("id", recipeId)
        .maybeSingle();
      return data;
    },
  });

  if (recipeQuery.isLoading) return <div>Loading...</div>;

  return <div>{JSON.stringify(recipeQuery.data)}</div>;
}
