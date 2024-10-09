import getQueryClient from "@/utils/getQueryClient";
import { useSupabaseServer } from "@/utils/supabase/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Recipe from "./Recipe";
import { queryKeys } from "@/queries/queryKeys";
import { fetchSession } from "@/queries/session";

export default async function RecipePage() {
  const queryClient = getQueryClient();
  const supabase = useSupabaseServer();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.session(),
    queryFn: () => fetchSession(supabase),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Recipe />
    </HydrationBoundary>
  );
}
