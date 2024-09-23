"use client";

import KakaoButton from "@/app/auth/callback/kakao-button";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function ProfileHeader({ handle }: { handle: string }) {
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

  const isMyPage = myProfileQuery.data?.handle === handle;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // all query invalidate
    queryClient.invalidateQueries();
    router.push("/");
  };

  if (mySessionQuery.isLoading) return <div>Loading...</div>;

  if (mySessionQuery.isError && mySessionQuery.error)
    return <div>Error: {mySessionQuery.error.message || "Unknown error"}</div>;

  if (isMyPage) {
    return (
      <div>
        <h1>
          My Profile, {mySessionQuery.data?.session?.user.user_metadata.handle}
        </h1>
        <button className="btn btn-primary" onClick={handleSignOut}>
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>{handle}님의 Profile</h1>
      <KakaoButton />
    </div>
  );
}
