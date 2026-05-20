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
) => {
  try {
    const range = getRange(page, 5);

    const { data, error } = await supabaseClient
      .from("logs")
      .select(`*, profiles(handle, email), likes:logs_likes(*)`)
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
