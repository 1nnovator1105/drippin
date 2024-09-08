"use client";

import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";

export default function AuthDropdown({ username }: { username: string }) {
  const supabase = createClient();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <details className="dropdown dropdown-end">
      <summary className="btn m-1">{username}</summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li onClick={signOut}>
          <a>로그아웃</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
      </ul>
    </details>
  );
}
