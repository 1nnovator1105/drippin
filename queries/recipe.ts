import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";
import { useSupabaseServer } from "@/utils/supabase/server";

export const fetchRecipeDetail = async (
  supabaseClient: TypedSupabaseClient,
  recipeId: string,
) => {
  const { data } = await supabaseClient
    .from("recipes")
    .select("*, profiles(handle, email), likes:recipes_likes(*)")
    .eq("id", recipeId)
    .eq("is_removed", false)
    .maybeSingle();

  return data;
};

export const fetchMyRecipe = async (
  supabaseClient: TypedSupabaseClient,
  userId: string,
) => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .select(`*, profiles(handle, email), likes:recipes_likes(*)`)
    .eq("user_id", userId)
    .eq("is_removed", false)
    .order("created_at", { ascending: false });

  return data;
};
