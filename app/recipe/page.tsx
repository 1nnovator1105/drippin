"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import KakaoButton from "../auth/callback/kakao-button";

export default function RecipePage() {
  const supabase = useSupabaseBrowser();

  const mySessionQuery = useQuery({
    queryKey: ["drippin", "mySession"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    },
  });

  if (mySessionQuery.isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>나의 레시피 목록</h1>

      {mySessionQuery.data?.session?.user.id ? (
        <Link href="/recipe/add">레시피 추가 페이지로 이동</Link>
      ) : (
        <KakaoButton />
      )}

      <div className="flex flex-col gap-4 mt-4">
        <div>여기 레시피1</div>
        <div>여기 레시피2</div>
        <div>여기 레시피3</div>
        <div>여기 레시피4</div>
        <div>여기 레시피5</div>
        <div>여기 레시피6</div>
        <div>...</div>
      </div>

      <hr />

      <div className="flex flex-col gap-4 mt-4">
        <div>여기 추천 레시피</div>
        <div>여기 추천 레시피</div>
        <div>여기 추천 레시피</div>
      </div>
    </div>
  );
}
