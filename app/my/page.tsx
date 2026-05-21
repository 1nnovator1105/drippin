import getQueryClient from "@/utils/getQueryClient";
import { getSupabaseServer } from "@/utils/supabase/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "@/queries/queryKeys";
import { fetchSession } from "@/queries/session";
import MyContent from "@/components/my/MyContent";

export default async function MyPage() {
  const queryClient = getQueryClient();
  const supabase = getSupabaseServer();

  const sessionData = await fetchSession(supabase);
  queryClient.setQueryData(queryKeys.session(), sessionData);

  // 로그인 상태면 프로필도 서버에서 미리 채워 클라 워터폴(세션→프로필) 제거
  const userId = sessionData?.session?.user.id;
  if (userId) {
    await queryClient.prefetchQuery({
      queryKey: ["drippin", "myProfile"],
      queryFn: async () => {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        return data;
      },
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MyContent />
    </HydrationBoundary>
  );
}
