import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";
import { getRange } from "@/utils/utils";

export const fetchRecipeDetail = async (
  supabaseClient: TypedSupabaseClient,
  recipeId: string,
) => {
  try {
    const { data } = await supabaseClient
      .from("recipes")
      .select(
        "*, profiles(handle, email), likes:recipes_likes(*), logs:logs(*)",
      )
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
  page: number = 0,
) => {
  try {
    const range = getRange(page, 5);

    const { data, error } = await supabaseClient
      .from("recipes")
      .select(`*, profiles(handle, email), likes:recipes_likes(*)`)
      .eq("user_id", userId)
      .eq("is_removed", false)
      .order("created_at", { ascending: false })
      .range(range[0], range[1]);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
