import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";

export interface MyStats {
  totalLogs: number;
  totalRecipes: number;
  thisMonthCount: number;
  monthly: { label: string; count: number }[];
  topPlaces: { name: string; count: number }[];
  topTags: { tag: string; count: number }[];
}

/**
 * 내 기록 요약 통계. 일지 전체(가벼운 컬럼만)와 레시피 수를 받아 집계한다.
 */
export const fetchMyStats = async (
  supabaseClient: TypedSupabaseClient,
  userId: string,
): Promise<MyStats> => {
  const [{ data: logs }, { count: recipeCount }] = await Promise.all([
    supabaseClient
      .from("logs")
      .select("created_at, coffee_place, tags")
      .eq("user_id", userId)
      .eq("is_removed", false),
    supabaseClient
      .from("recipes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_removed", false),
  ]);

  const rows = logs ?? [];
  const now = new Date();

  // 최근 6개월 버킷 (오래된 → 최신)
  const monthBuckets: { key: string; label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthBuckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: `${d.getMonth() + 1}월`,
      count: 0,
    });
  }
  const thisMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  let thisMonthCount = 0;

  const placeCount = new Map<string, number>();
  const tagCount = new Map<string, number>();

  for (const row of rows) {
    const d = new Date(row.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = monthBuckets.find((b) => b.key === key);
    if (bucket) bucket.count += 1;
    if (key === thisMonthKey) thisMonthCount += 1;

    const place = row.coffee_place?.trim();
    if (place) placeCount.set(place, (placeCount.get(place) ?? 0) + 1);

    row.tags
      ?.split(/\s+/)
      .map((t) => t.replace(/^#/, "").trim())
      .filter(Boolean)
      .forEach((t) => tagCount.set(t, (tagCount.get(t) ?? 0) + 1));
  }

  const top = (m: Map<string, number>, n: number) =>
    Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n);

  return {
    totalLogs: rows.length,
    totalRecipes: recipeCount ?? 0,
    thisMonthCount,
    monthly: monthBuckets.map(({ label, count }) => ({ label, count })),
    topPlaces: top(placeCount, 3).map(([name, count]) => ({ name, count })),
    topTags: top(tagCount, 5).map(([tag, count]) => ({ tag, count })),
  };
};
