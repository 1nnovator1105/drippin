import getQueryClient from "@/utils/getQueryClient";
import ProfileHome from "@/components/profile/ProfileHome";
import { getSupabaseServer } from "@/utils/supabase/server";
import { fetchProfileByHandle } from "@/queries/profile";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ProfilePage({
  params,
}: {
  params: { handle: string };
}) {
  const handle = decodeURIComponent(params.handle);
  const queryClient = getQueryClient();
  const supabase = getSupabaseServer();

  await queryClient.prefetchQuery({
    queryKey: ["drippin", "profile", handle],
    queryFn: () => fetchProfileByHandle(supabase, handle),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfileHome handle={handle} />
    </HydrationBoundary>
  );
}
