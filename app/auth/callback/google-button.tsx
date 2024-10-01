"use client";

import { logEvent } from "@/utils/analytics";
import events from "@/utils/events";
import useSupabaseBrowser from "@/utils/supabase/client";

export default function GoogleButton() {
  const supabase = useSupabaseBrowser();

  const signInWithGoogle = async () => {
    logEvent(events.clickLogin, {
      provider: "google",
    });
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="btn bg-[url('/assets/images/web_neutral_sq_ctn@3x.png')] bg-contain bg-center text-black font-bold w-[183px] h-[45px]"
    ></button>
  );
}
