import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";

export const fetchRecipeDetail = async (
  supabaseClient: TypedSupabaseClient,
  recipeId: string,
) => {
  try {
    const { data } = await supabaseClient
      .from("recipes")
      .select("*, profiles(handle, email), likes:recipes_likes(*)")
      .eq("id", recipeId)
      .eq("is_removed", false)
      .maybeSingle();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchMyRecipe = async (
  supabaseClient: TypedSupabaseClient,
  userId: string,
) => {
  try {
    const { data, error } = await supabaseClient
      .from("recipes")
      .select(`*, profiles(handle, email), likes:recipes_likes(*)`)
      .eq("user_id", userId)
      .eq("is_removed", false)
      .order("created_at", { ascending: false });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
