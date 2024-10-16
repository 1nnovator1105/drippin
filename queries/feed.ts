import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";
import { getRange } from "@/utils/utils";

export const fetchRecipeFeed = async (
  supabaseClient: TypedSupabaseClient,
  page: number,
) => {
  try {
    const range = getRange(page, 5);

    const { data, error } = await supabaseClient
      .from("recipes")
      .select(`*, profiles(handle, email), likes:recipes_likes(*)`)
      .eq("is_removed", false)
      .order("created_at", { ascending: false })
      .range(range[0], range[1]);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchLogFeed = async (
  supabaseClient: TypedSupabaseClient,
  page: number,
) => {
  try {
    const range = getRange(page, 5);

    const { data, error } = await supabaseClient
      .from("logs")
      .select(`*, profiles(handle, email), likes:logs_likes(*)`)
      .eq("is_removed", false)
      .order("created_at", { ascending: false })
      .range(range[0], range[1]);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
