"use client";

import LoginNudge from "@/components/auth/LoginNudge";
import LogCard from "@/components/home/LogCard";
import Header from "@/components/share/Header";
import Spinner from "@/components/share/Spinner";
import { logEvent } from "@/utils/analytics";
import events from "@/utils/events";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LogPage() {
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const mySessionQuery = useQuery({
    queryKey: ["drippin", "session"],
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
        .eq("is_removed", false)
        .order("created_at", { ascending: false });

      return data;
    },
    enabled: !!mySessionQuery.data?.session?.user.id,
  });

  const preventClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    e.preventDefault();
    logEvent(events.clickAddLog);
    router.push("/log/add");
  };

  if (mySessionQuery.isLoading || myLogQuery.isLoading) return <Spinner />;

  if (!mySessionQuery.data?.session) return <LoginNudge />;

  return (
    <div className="pb-[88px] flex flex-col justify-center items-center">
      <Header title="일지" />

      <div className="flex flex-col w-full">
        {myLogQuery.data?.map((log) => (
          <LogCard key={log.id} log={log} summary />
        ))}
      </div>

      {!myLogQuery.data?.length && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
          아직 작성된 일지가 없어요
          <br />
          오늘은 어떤 커피를 드셨나요?
        </div>
      )}

      {mySessionQuery.data?.session?.user.id && !myLogQuery.isLoading && (
        <Link
          href="/log/add"
          className="fixed bottom-[88px] flex py-[10px] px-[20px] bg-black rounded-3xl text-white self-center"
          onClick={preventClick}
          style={{
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          새로운 일지 작성하기
        </Link>
      )}
    </div>
  );
}
