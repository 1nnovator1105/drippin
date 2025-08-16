import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";

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
) => {
  try {
    const { data, error } = await supabaseClient
      .from("logs")
      .select(`*, profiles(handle, email), likes:logs_likes(*)`)
      .eq("user_id", userId)
      .eq("is_removed", false)
      .order("created_at", { ascending: false });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
