"use client";

import LoginNudge from "@/components/auth/LoginNudge";
import LogCard from "@/components/share/LogCard";
import Header from "@/components/share/Header";
import Spinner from "@/components/share/Spinner";
import { logEvent } from "@/utils/analytics";
import events from "@/utils/events";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FetchMore from "@/components/share/FetchMore";
import { fetchMyLog } from "@/queries/log";

export default function Log() {
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const mySessionQuery = useQuery({
    queryKey: ["drippin", "session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    },
  });

  const myLogQuery = useInfiniteQuery({
    queryKey: ["drippin", "logs", "my"],
    queryFn: ({ pageParam }) =>
      fetchMyLog(supabase, mySessionQuery.data?.session?.user.id!, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length : undefined,
    initialPageParam: 0,
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
        {myLogQuery.data?.pages.map((logs) =>
          logs?.map((log) => <LogCard key={log.id} log={log} summary />),
        )}
        <FetchMore
          fetchNextPage={myLogQuery.fetchNextPage}
          hasNextPage={myLogQuery.hasNextPage}
          isError={myLogQuery.isError}
        />
      </div>

      {!myLogQuery.data?.pages?.[0]?.length && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
          아직 작성된 일지가 없어요
          <br />
          오늘은 어떤 커피를 드셨나요?
        </div>
      )}

      {mySessionQuery.data?.session?.user.id && !myLogQuery.isLoading && (
        <Link
          href="/log/add"
          className="fixed bottom-[88px] flex py-[10px] px-[20px] bg-brand rounded-3xl text-brand-foreground self-center"
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
