import { queryKeys } from "@/queries/queryKeys";
import { fetchSession } from "@/queries/session";
import { fetchMyLog } from "@/queries/log";
import getQueryClient from "@/utils/getQueryClient";
import { getSupabaseServer } from "@/utils/supabase/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Log from "./Log";

export default async function LogPage() {
  const queryClient = getQueryClient();
  const supabase = getSupabaseServer();

  const sessionData = await fetchSession(supabase);
  queryClient.setQueryData(queryKeys.session(), sessionData);

  // 로그인 상태면 첫 페이지 목록까지 서버에서 채워 세션→목록 워터폴 제거
  const userId = sessionData?.session?.user.id;
  if (userId) {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["drippin", "logs", "my", ""],
      queryFn: ({ pageParam }) =>
        fetchMyLog(supabase, userId, pageParam as number, ""),
      initialPageParam: 0,
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Log />
    </HydrationBoundary>
  );
}
