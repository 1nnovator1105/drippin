"use client";

import LoginNudge from "@/components/auth/LoginNudge";
import LogCard from "@/components/share/LogCard";
import Header from "@/components/share/Header";
import Spinner from "@/components/share/Spinner";
import { logEvent } from "@/utils/analytics";
import events from "@/utils/events";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FetchMore from "@/components/share/FetchMore";
import { fetchMyLog } from "@/queries/log";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import useSession from "@/hooks/useSession";
import { Search } from "lucide-react";

export default function Log() {
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  const mySessionQuery = useSession();

  const myLogQuery = useInfiniteQuery({
    queryKey: ["drippin", "logs", "my", debouncedKeyword],
    queryFn: ({ pageParam }) =>
      fetchMyLog(
        supabase,
        mySessionQuery.data?.session?.user.id!,
        pageParam,
        debouncedKeyword,
      ),
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

  if (mySessionQuery.isLoading) return <Spinner />;

  if (!mySessionQuery.data?.session) return <LoginNudge />;

  const hasResults = !!myLogQuery.data?.pages?.[0]?.length;
  const isSearching = debouncedKeyword.trim() !== "";

  return (
    <div className="pb-[88px] flex flex-col items-center">
      <Header title="일지" />

      <div className="w-full px-3 pt-2 pb-3 border-b border-stone-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="원두·카페·내용·태그 검색"
            aria-label="일지 검색"
            type="search"
            className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      <div className="flex flex-col w-full">
        {myLogQuery.isPending ? (
          <Spinner />
        ) : (
          <>
            {myLogQuery.data?.pages.map((logs) =>
              logs?.map((log) => <LogCard key={log.id} log={log} summary />),
            )}
            <FetchMore
              fetchNextPage={myLogQuery.fetchNextPage}
              hasNextPage={myLogQuery.hasNextPage}
              isError={myLogQuery.isError}
            />
          </>
        )}
      </div>

      {!myLogQuery.isPending && !hasResults && (
        <div className="mt-20 w-full text-center text-stone-500">
          {isSearching ? (
            "검색 결과가 없어요"
          ) : (
            <>
              아직 작성된 일지가 없어요
              <br />
              오늘은 어떤 커피를 드셨나요?
            </>
          )}
        </div>
      )}

      {mySessionQuery.data?.session?.user.id && (
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
