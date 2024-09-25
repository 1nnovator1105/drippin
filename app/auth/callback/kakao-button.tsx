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
    <button
      onClick={signInWithKakao}
      className="btn bg-[url('/assets/images/kakao_login_large_narrow.png')] bg-cover bg-center text-black font-bold w-[183px] h-[45px]"
    ></button>
  );
}
