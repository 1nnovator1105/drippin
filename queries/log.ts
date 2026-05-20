import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";
import { getRange } from "@/utils/utils";

export const fetchLogDetail = async (
  supabaseClient: TypedSupabaseClient,
  logId: string,
) => {
  try {
    const { data, error } = await supabaseClient
      .from("logs")
      .select(
        `*, recipes(recipe_name), profiles(handle, email), likes:logs_likes(*)`,
      )
      .eq("id", logId)
      .eq("is_removed", false)
      .maybeSingle();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchMyLog = async (
  supabaseClient: TypedSupabaseClient,
  userId: string,
  page: number = 0,
  keyword: string = "",
) => {
  try {
    const range = getRange(page, 5);

    let query = supabaseClient
      .from("logs")
      .select(`*, profiles(handle, email), likes:logs_likes(*)`)
      .eq("user_id", userId)
      .eq("is_removed", false);

    // 쉼표/퍼센트는 or 필터 문법을 깨뜨려 제거
    const safeKeyword = keyword.trim().replace(/[,%]/g, "");
    if (safeKeyword) {
      query = query.or(
        `content.ilike.%${safeKeyword}%,coffee_name.ilike.%${safeKeyword}%,coffee_place.ilike.%${safeKeyword}%,tags.ilike.%${safeKeyword}%`,
      );
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .range(range[0], range[1]);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
