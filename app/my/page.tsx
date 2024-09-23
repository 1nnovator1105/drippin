"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import KakaoButton from "../auth/callback/kakao-button";

export default function MyPage() {
  const supabase = useSupabaseBrowser();

  const queryClient = useQueryClient();
  const router = useRouter();

  const mySessionQuery = useQuery({
    queryKey: ["drippin", "mySession"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    },
  });

  const myProfileQuery = useQuery({
    queryKey: ["drippin", "myProfile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", mySessionQuery.data?.session?.user.id!)
        .throwOnError()
        .single();
      return data;
    },
    enabled: !!mySessionQuery.data?.session?.user.id,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // all query invalidate
    queryClient.invalidateQueries();
    router.push("/");
  };

  if (mySessionQuery.isLoading) return <div>Loading...</div>;

  if (!mySessionQuery.data?.session)
    return (
      <div>
        로그인이 필요합니다.
        <KakaoButton />
      </div>
    );

  return (
    <div>
      <h1>MyPage</h1>
      <div>email: {myProfileQuery.data?.email}</div>
      <div>handle: {myProfileQuery.data?.handle}</div>
      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
}
