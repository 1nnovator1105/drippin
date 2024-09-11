import ProfileHeader from "@/components/profile/ProfileHeader";
import { getUserByHandle } from "@/queries/user";
import getQueryClient from "@/utils/getQueryClient";
import { useSupabaseServer } from "@/utils/supabase/server";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function UserProfilePage({
  params,
}: {
  params: { handle: string };
}) {
  const queryClient = getQueryClient();
  const supabase = useSupabaseServer();

  await prefetchQuery(queryClient, getUserByHandle(supabase, params.handle));

  // Neat! Serialization is now as easy as passing props.
  // HydrationBoundary is a Client Component, so hydration will happen there.
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileHeader handle={params.handle} />
    </HydrationBoundary>
  );
}
