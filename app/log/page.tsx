import { queryKeys } from "@/queries/queryKeys";
import { fetchSession } from "@/queries/session";
import getQueryClient from "@/utils/getQueryClient";
import { useSupabaseServer } from "@/utils/supabase/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Log from "./Log";

export default async function LogPage() {
  const queryClient = getQueryClient();
  const supabase = useSupabaseServer();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.session(),
    queryFn: () => fetchSession(supabase),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Log />
    </HydrationBoundary>
  );
}
