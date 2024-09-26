"use client";

import DefaultThumbnail from "@/components/share/DefaultThumbnail";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function LogDetailPage() {
  const { logId } = useParams();
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const logQuery = useQuery({
    queryKey: ["drippin", "log", logId],
    queryFn: async () => {
      console.log("logId", logId);
      const { data } = await supabase
        .from("logs")
        .select("*")
        .eq("id", logId)
        .maybeSingle();
      return data;
    },
  });

  if (logQuery.isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 flex flex-row gap-2 items-center text-xl font-bold z-[50] bg-white justify-between px-2 py-2">
        <div className="flex flex-row gap-2 items-center line-clamp-1">
          <ArrowLeft className="size-8" onClick={() => router.back()} />
          {logQuery.data?.coffee_place}에서 마신 {logQuery.data?.coffee_name}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative w-full aspect-[1/1]">
          {logQuery.data?.image_url ? (
            <Image
              src={logQuery.data?.image_url}
              alt="log"
              className="w-full h-full object-cover"
              fill
            />
          ) : (
            <DefaultThumbnail
              title={`${logQuery.data?.coffee_place}에서 마신 ${logQuery.data?.coffee_name}`}
              handle={logQuery.data?.profiles?.handle || ""}
            />
          )}
        </div>

        <div
          className="px-2"
          dangerouslySetInnerHTML={{
            __html: logQuery.data?.content || "",
          }}
        />
      </div>
    </div>
  );
}
