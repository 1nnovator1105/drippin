"use client";

import { getUserByUserName } from "@/queries/get-note-by-id";
import useUserQueries from "@/queries/user";
import useSupabaseBrowser from "@/utils/supabase-browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export default function ProfileHeader({ username }: { username: string }) {
  const supabase = useSupabaseBrowser();
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  const { data: user, isLoading } = useQuery(
    getUserByUserName(supabase, username),
  );

  const isMyPage = user?.user_name === decodeURI(username);

  if (isLoading) return <div>Loading...</div>;

  if (isMyPage) {
    return (
      <div>
        <h1>My Profile, {user?.user_name}</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{decodeURI(username)}님의 Profile</h1>
      <p>안녕하세요. {user?.user_name}님</p>
    </div>
  );
}
