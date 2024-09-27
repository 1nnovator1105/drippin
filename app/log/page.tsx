"use client";

import LoginNudge from "@/components/auth/LoginNudge";
import LogCard from "@/components/home/LogCard";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function LogPage() {
  const supabase = useSupabaseBrowser();

  const mySessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    },
  });

  const myLogQuery = useQuery({
    queryKey: ["drippin", "logs", "my"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("logs")
        .select(`*, profiles(handle, email), likes:logs_likes(*)`)
        .eq("user_id", mySessionQuery.data?.session?.user.id!)
        .order("created_at", { ascending: false });

      console.log("data");
      console.log(data);

      return data;
    },
    enabled: !!mySessionQuery.data?.session?.user.id,
  });

  if (!mySessionQuery.data?.session) return <LoginNudge />;

  return (
    <div className="pb-[88px] flex justify-center items-center">
      <div className="flex flex-col">
        {myLogQuery.data?.map((log) => (
          <LogCard key={log.id} log={log} summary />
        ))}
      </div>

      <Link
        href="/log/add"
        className="fixed bottom-[88px] flex py-[15px] px-[20px] bg-black rounded-3xl text-white self-center"
      >
        새로운 일지 작성하기
      </Link>
    </div>
  );
}
