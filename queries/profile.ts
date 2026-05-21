import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";

export interface ProfileSummary {
  id: string;
  handle: string | null;
  userName: string;
  recipeCount: number;
  logCount: number;
}

/**
 * 공개 프로필 홈 — handle로 사용자를 찾아 요약(프로필 + 레시피/일지 개수)을 반환.
 * handle 유니크 제약 전이라도 깨지지 않도록 limit 1로 안전 처리한다.
 */
export const fetchProfileByHandle = async (
  supabaseClient: TypedSupabaseClient,
  handle: string,
): Promise<ProfileSummary | null> => {
  const { data: profiles } = await supabaseClient
    .from("profiles")
    .select("id, handle, user_name")
    .eq("handle", handle)
    .limit(1);

  const profile = profiles?.[0];
  if (!profile) return null;

  const [{ count: recipeCount }, { count: logCount }] = await Promise.all([
    supabaseClient
      .from("recipes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("is_removed", false),
    supabaseClient
      .from("logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("is_removed", false),
  ]);

  return {
    id: profile.id,
    handle: profile.handle,
    userName: profile.user_name,
    recipeCount: recipeCount ?? 0,
    logCount: logCount ?? 0,
  };
};

/**
 * 닉네임(handle) 중복 검사 — 본인 외 다른 사용자가 이미 사용 중인지.
 */
export const isHandleTaken = async (
  supabaseClient: TypedSupabaseClient,
  handle: string,
  myUserId: string,
): Promise<boolean> => {
  const { data } = await supabaseClient
    .from("profiles")
    .select("id")
    .eq("handle", handle)
    .neq("id", myUserId)
    .limit(1);

  return (data?.length ?? 0) > 0;
};
