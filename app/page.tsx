import HomeWrapper from "@/components/home/HomeWrapper";
import { fetchLogFeed, fetchRecipeFeed } from "@/queries/feed";
import { queryKeys } from "@/queries/queryKeys";
import getQueryClient from "@/utils/getQueryClient";
import { useSupabaseServer } from "@/utils/supabase/server";
import {
  HydrationBoundary,
  dehydrate,
  useInfiniteQuery,
} from "@tanstack/react-query";

export default async function Index() {
  const queryClient = getQueryClient();
  const supabase = useSupabaseServer();

  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.recipeFeed(),
    queryFn: ({ pageParam }) => fetchRecipeFeed(supabase, pageParam),
    initialPageParam: 0,
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.logFeed(),
    queryFn: ({ pageParam }) => fetchLogFeed(supabase, pageParam),
    initialPageParam: 0,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeWrapper />
    </HydrationBoundary>
  );
}
