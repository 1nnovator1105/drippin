import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";
import { getRange } from "@/utils/utils";

/**
 * 특정 태그가 포함된 공개 일지(페이지네이션). tag는 # 없는 순수 단어.
 */
export const fetchLogsByTag = async (
  supabaseClient: TypedSupabaseClient,
  tag: string,
  page: number = 0,
) => {
  const range = getRange(page, 5);
  const safe = tag.trim().replace(/[%,]/g, "");

  const { data } = await supabaseClient
    .from("logs")
    .select(`*, profiles(handle, email), likes:logs_likes(*)`)
    .eq("is_removed", false)
    .ilike("tags", `%${safe}%`)
    .order("created_at", { ascending: false })
    .range(range[0], range[1]);

  return data;
};
