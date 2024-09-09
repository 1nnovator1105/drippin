import ProfileHeader from "@/components/profile/ProfileHeader";
import { getUserByUserName } from "@/queries/get-note-by-id";
import { prefetchUserQuery } from "@/queries/user";
import useSupabaseServer from "@/utils/supabase-server";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);

  await prefetchQuery(
    queryClient,
    getUserByUserName(supabase, params.username),
  );

  // Neat! Serialization is now as easy as passing props.
  // HydrationBoundary is a Client Component, so hydration will happen there.
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileHeader username={params.username} />
    </HydrationBoundary>
  );
}
