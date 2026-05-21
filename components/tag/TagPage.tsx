"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useSupabaseBrowser from "@/utils/supabase/client";
import { fetchLogsByTag } from "@/queries/tag";
import LogCard from "@/components/share/LogCard";
import FetchMore from "@/components/share/FetchMore";
import BackIcon from "@/components/icon/BackIcon";

export default function TagPage({ tag }: { tag: string }) {
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const logQuery = useInfiniteQuery({
    queryKey: ["drippin", "tag", tag, "log"],
    queryFn: ({ pageParam }) => fetchLogsByTag(supabase, tag, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length : undefined,
    initialPageParam: 0,
  });

  const isEmpty =
    !logQuery.isPending && !logQuery.data?.pages?.[0]?.length;

  return (
    <div className="flex flex-col pb-[88px]">
      <div className="flex items-center gap-2 px-3 py-2">
        <button aria-label="뒤로" onClick={() => router.back()} className="p-1">
          <BackIcon />
        </button>
      </div>

      <div className="bg-brand-soft px-4 pb-4 pt-2">
        <p className="text-xl font-bold text-brand">#{tag}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          이 태그가 담긴 일지
        </p>
      </div>

      <div className="w-full">
        {logQuery.data?.pages.map((logs) =>
          logs?.map((log) => <LogCard key={log.id} log={log} summary />),
        )}
        <FetchMore
          fetchNextPage={logQuery.fetchNextPage}
          hasNextPage={logQuery.hasNextPage}
          isError={logQuery.isError}
        />
        {isEmpty && (
          <div className="mt-16 text-center text-stone-500">
            이 태그의 일지가 없어요
          </div>
        )}
      </div>
    </div>
  );
}
