import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";

export const fetchLogDetail = async (
  supabaseClient: TypedSupabaseClient,
  logId: string,
) => {
  const { data, error } = await supabaseClient
    .from("logs")
    .select(`*, profiles(handle, email), likes:logs_likes(*)`)
    .eq("id", logId)
    .eq("is_removed", false)
    .maybeSingle();

  return data;
};

export const fetchMyLog = async (
  supabaseClient: TypedSupabaseClient,
  userId: string,
) => {
  const { data, error } = await supabaseClient
    .from("logs")
    .select(`*, profiles(handle, email), likes:logs_likes(*)`)
    .eq("user_id", userId)
    .eq("is_removed", false)
    .order("created_at", { ascending: false });

  return data;
};
