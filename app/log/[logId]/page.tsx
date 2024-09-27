"use client";

import LikeIcon from "@/components/icon/LikeIcon";
import DefaultThumbnail from "@/components/share/DefaultThumbnail";
import TagChip from "@/components/share/TagChip";
import useSupabaseBrowser from "@/utils/supabase/client";
import { secToKoreanTime } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";

export default function LogDetailPage() {
  const { logId } = useParams();
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const logQuery = useQuery({
    queryKey: ["drippin", "log", logId],
    queryFn: async () => {
      const { data } = await supabase
        .from("logs")
        .select(`*, profiles(handle, email), likes:logs_likes(*)`)
        .eq("id", logId)
        .maybeSingle();
      return data;
    },
  });

  const deleteMutate = useMutation({
    mutationFn: async () => {
      const { data } = await supabase
        .from("logs")
        .delete()
        .eq("id", logId)
        .maybeSingle();

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drippin"] });
      router.back();
    },
  });

  const mySessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    },
  });

  const likeMutate = useMutation({
    mutationFn: async () => {
      if (!mySessionQuery.data?.session) throw Error("세션이 필요합니다.");

      const { data, error } = await supabase.from("logs_likes").insert({
        log_id: Number(logId),
        from_user_id: mySessionQuery.data.session.user.id,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drippin"] });
    },
  });

  const unlikeMutate = useMutation({
    mutationFn: async () => {
      if (!mySessionQuery.data?.session) throw Error("세션이 필요합니다.");

      const { data, error } = await supabase
        .from("logs_likes")
        .delete()
        .eq("log_id", Number(logId))
        .eq("from_user_id", mySessionQuery.data?.session?.user.id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drippin"] });
    },
  });

  const isLiked = logQuery.data?.likes?.some(
    (like) => like.from_user_id === mySessionQuery.data?.session?.user.id,
  );

  const conditionLikeAction = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLiked) {
      unlikeMutate.mutate();
    } else {
      likeMutate.mutate();
    }
  };

  const deteRecipe = () => {
    deleteMutate.mutate();
  };

  if (logQuery.isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 flex flex-row gap-2 justify-between px-3 items-center text-xl font-bold z-[50] bg-white h-[52px] border-b-[1px] border-[#D9D9D9]">
        <div className="cursor-pointer" onClick={() => router.back()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="26"
            viewBox="0 0 15 26"
            fill="none"
          >
            <path
              d="M12.75 25.5C12.5861 25.502 12.4235 25.4697 12.2728 25.4051C12.1221 25.3405 11.9866 25.2451 11.875 25.125L0.625 13.875C0.125 13.375 0.125 12.6 0.625 12.1L11.875 0.875C12.375 0.375 13.15 0.375 13.65 0.875C14.15 1.375 14.15 2.15 13.65 2.65L3.275 13L13.65 23.375C14.15 23.875 14.15 24.65 13.65 25.15C13.4 25.4 13.075 25.525 12.775 25.525L12.75 25.5Z"
              fill="#1E1E1E"
            />
          </svg>
        </div>

        <details className="dropdown dropdown-end cursor-pointer">
          <summary className="border-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 4.0625C10.5178 4.0625 10.9375 3.64277 10.9375 3.125C10.9375 2.60723 10.5178 2.1875 10 2.1875C9.48223 2.1875 9.0625 2.60723 9.0625 3.125C9.0625 3.64277 9.48223 4.0625 10 4.0625Z"
                stroke="#1E1E1E"
                stroke-width="1.875"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 10.9375C10.5178 10.9375 10.9375 10.5178 10.9375 10C10.9375 9.48223 10.5178 9.0625 10 9.0625C9.48223 9.0625 9.0625 9.48223 9.0625 10C9.0625 10.5178 9.48223 10.9375 10 10.9375Z"
                stroke="#1E1E1E"
                stroke-width="1.875"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 17.8125C10.5178 17.8125 10.9375 17.3928 10.9375 16.875C10.9375 16.3572 10.5178 15.9375 10 15.9375C9.48223 15.9375 9.0625 16.3572 9.0625 16.875C9.0625 17.3928 9.48223 17.8125 10 17.8125Z"
                stroke="#1E1E1E"
                stroke-width="1.875"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box min-w-[83px] z-[1] p-3 shadow top-[30px] rounded-lg">
            <li className="text-center" onClick={deteRecipe}>
              삭제하기
            </li>
          </ul>
        </details>
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

        <div className="flex flex-col px-3 py-3 gap-3">
          <div className="flex items-center gap-[6px]">
            <div onClick={conditionLikeAction}>
              <LikeIcon
                fill={isLiked ? "#1E1E1E" : "#FFF"}
                stroke={"#1E1E1E"}
                strokeWidth="2.5"
              />
            </div>
            <span>
              {logQuery.data?.likes?.length || 0}명의 드리핀이 좋아해요
            </span>
          </div>

          <div className="flex font-bold">
            {logQuery.data?.coffee_place}에서 마신 {logQuery.data?.coffee_name}
          </div>

          <div className="line-clamp-3 text-gray-900">
            <span className="text-gray-500">
              @{logQuery.data?.profiles?.handle}
            </span>{" "}
            {logQuery.data?.content}
          </div>

          <div className="mt-3">
            {logQuery.data?.tags?.split(" ").join(" ")}
          </div>

          <div className="mt-3">
            {format(
              new Date(logQuery.data?.created_at || ""),
              "yyyy년 MM월 dd일",
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
