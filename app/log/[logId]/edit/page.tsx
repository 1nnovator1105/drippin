import { queryKeys } from "@/queries/queryKeys";
import { fetchRecipeDetail } from "@/queries/recipe";
import getQueryClient from "@/utils/getQueryClient";
import { useSupabaseServer } from "@/utils/supabase/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import EditLog from "./EditLog";
import { fetchLogDetail } from "@/queries/log";

export default async function EditRecipePage({
  params,
}: {
  params: { logId: string };
}) {
  const { logId } = params;
  const supabase = useSupabaseServer();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.logDetail(logId),
    queryFn: () => fetchLogDetail(supabase, logId),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <EditLog logId={logId} />
    </HydrationBoundary>
  );
}
