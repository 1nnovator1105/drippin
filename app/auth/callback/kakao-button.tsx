"use client";

import { createClient } from "@/utils/supabase/client";

export default function KakaoButton() {
  const supabase = createClient();

  const signInWithKakao = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <button
      onClick={signInWithKakao}
      className="w-full rounded-xl bg-slate-100 px-4 py-2"
    >
      카카오 로그인
    </button>
  );
}
