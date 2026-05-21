"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useSupabaseBrowser from "@/utils/supabase/client";
import { fetchLogsByTag } from "@/queries/tag";
import LogCard from "@/components/share/LogCard";
import FetchMore from "@/components/share/FetchMore";
import { ChevronLeft, Tag } from "lucide-react";

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
      <div className="border-b border-stone-200 bg-brand-soft px-2 pb-3 pt-2">
        <div className="flex items-center gap-1.5">
          <button
            aria-label="뒤로"
            onClick={() => router.back()}
            className="flex size-8 shrink-0 items-center justify-center text-brand"
          >
            <ChevronLeft className="size-6" />
          </button>
          <Tag className="size-5 shrink-0 text-brand" strokeWidth={2.5} />
          <h1 className="truncate text-lg font-bold tracking-tight text-brand">
            #{tag}
          </h1>
        </div>
        <p className="mt-0.5 pl-[3.25rem] text-sm text-muted-foreground">
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
