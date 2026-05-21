import getQueryClient from "@/utils/getQueryClient";
import { getSupabaseServer } from "@/utils/supabase/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Recipe from "./Recipe";
import { queryKeys } from "@/queries/queryKeys";
import { fetchSession } from "@/queries/session";
import { fetchMyRecipe } from "@/queries/recipe";

export default async function RecipePage() {
  const queryClient = getQueryClient();
  const supabase = getSupabaseServer();

  const sessionData = await fetchSession(supabase);
  queryClient.setQueryData(queryKeys.session(), sessionData);

  // 로그인 상태면 첫 페이지 목록까지 서버에서 채워 세션→목록 워터폴 제거
  const userId = sessionData?.session?.user.id;
  if (userId) {
    await queryClient.prefetchInfiniteQuery({
      queryKey: [...queryKeys.myRecipe(), "", "all"],
      queryFn: ({ pageParam }) =>
        fetchMyRecipe(supabase, userId, pageParam as number, "", "all"),
      initialPageParam: 0,
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Recipe />
    </HydrationBoundary>
  );
}
