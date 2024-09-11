"use client";

import { fetchMySelf } from "@/queries/user";
import { Database } from "@/types/database.types";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BottomTabNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useSupabaseBrowser();

  const [mySelf, setMySelf] = useState<
    Database["public"]["Tables"]["profiles"]["Row"] | null
  >(null);

  useEffect(() => {
    const fetchMe = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        const { data: user, error } = await fetchMySelf(supabase, data.user.id);
        setMySelf(user);
      } else {
        console.log("로그인이 필요함");
      }
    };

    fetchMe();
  }, []);

  const route = (path: string) => {
    router.push(path);
  };

  const isMyPage = mySelf?.handle === pathname;

  return (
    <div
      className="btm-nav max-w-3xl mx-auto md:border-x-[1px]"
      style={{
        boxShadow: "0px -5px 5px 0px rgb(0,0,0,0.02)",
      }}
    >
      <button
        className={pathname === "/" ? "active" : ""}
        onClick={() => route("/")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button>
      <button
        className={pathname === "/notes" ? "active" : ""}
        onClick={() => route("/notes")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <button
        className={isMyPage ? "active" : ""}
        onClick={() => route(`/${mySelf?.handle}`)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>
    </div>
  );
}
