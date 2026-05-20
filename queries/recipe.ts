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
  keyword: string = "",
  temperature: "all" | "ice" | "hot" = "all",
) => {
  try {
    const range = getRange(page, 5);

    let query = supabaseClient
      .from("recipes")
      .select(`*, profiles(handle, email), likes:recipes_likes(*)`)
      .eq("user_id", userId)
      .eq("is_removed", false);

    // 쉼표/퍼센트는 or 필터 문법을 깨뜨려 제거
    const safeKeyword = keyword.trim().replace(/[,%]/g, "");
    if (safeKeyword) {
      query = query.or(
        `recipe_name.ilike.%${safeKeyword}%,recipe_description.ilike.%${safeKeyword}%`,
      );
    }
    if (temperature === "ice") query = query.eq("is_ice", true);
    if (temperature === "hot") query = query.eq("is_hot", true);

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .range(range[0], range[1]);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
