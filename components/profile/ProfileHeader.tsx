"use client";

import { getUserByHandle } from "@/queries/user";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export default function ProfileHeader({ handle }: { handle: string }) {
  const supabase = useSupabaseBrowser();
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery(getUserByHandle(supabase, handle));

  const isMyPage = user?.handle === handle;

  if (isLoading) return <div>Loading...</div>;

  if (isError && error)
    return <div>Error: {error.message || "Unknown error"}</div>;

  if (isMyPage) {
    return (
      <div>
        <h1>My Profile, {user?.user_name}</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{user?.handle}님의 Profile</h1>
      <p>안녕하세요. {user?.user_name}님</p>
    </div>
  );
}
