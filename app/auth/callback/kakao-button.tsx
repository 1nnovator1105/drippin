"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { generateRandomName } from "@/utils/utils";

export default function KakaoButton() {
  const supabase = useSupabaseBrowser();

  const signInWithKakao = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button onClick={signInWithKakao} className="btn btn-outline">
      카카오 로그인
    </button>
  );
}
