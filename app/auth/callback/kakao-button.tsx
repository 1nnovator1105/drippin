"use client";

import { logEvent } from "@/utils/analytics";
import events from "@/utils/events";
import useSupabaseBrowser from "@/utils/supabase/client";
import { generateRandomName } from "@/utils/utils";

export default function KakaoButton() {
  const supabase = useSupabaseBrowser();

  const signInWithKakao = async () => {
    logEvent(events.clickLogin, {
      provider: "kakao",
    });
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
      className="block btn bg-[#FEE500] bg-[url('/assets/images/kakao_login_medium_wide.png')] bg-contain bg-center bg-no-repeat text-black font-bold w-[283px] h-[42px] min-h-10 mb-3"
    ></button>
  );
}
