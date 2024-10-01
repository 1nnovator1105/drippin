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
        redirectTo: `${window.location.origin}/auth/callback`,
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
      className="block btn bg-[#F2F2F2] bg-[url('/assets/images/web_neutral_sq_SI@2x.png')] bg-contain bg-center bg-no-repeat text-black font-bold w-[283px] h-[42px] min-h-10"
    ></button>
  );
}
