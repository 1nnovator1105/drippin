import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import KakaoButton from "@/app/auth/callback/kakao-button";
import AuthDropdown from "./auth/AuthDropdown";
import { useSupabaseServer } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = useSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <KakaoButton />
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      <AuthDropdown username={user.user_metadata.user_name} />
    </div>
  ) : (
    <div className="flex item-center gap-4">
      <KakaoButton />
    </div>
  );
}
