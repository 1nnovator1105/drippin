import getQueryClient from "@/utils/getQueryClient";
import LogDetail from "./LogDetail";
import { useSupabaseServer } from "@/utils/supabase/server";
import { queryKeys } from "@/queries/queryKeys";
import { fetchSession } from "@/queries/session";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchLogDetail } from "@/queries/log";

export default async function LogDetailPage({
  params,
}: {
  params: { logId: string };
}) {
  const { logId } = params;
  const queryClient = getQueryClient();
  const supabase = useSupabaseServer();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.session(),
    queryFn: () => fetchSession(supabase),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.logDetail(logId),
    queryFn: () => fetchLogDetail(supabase, logId),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <LogDetail logId={logId} />
    </HydrationBoundary>
  );
}
