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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import Spinner from "@/components/share/Spinner";
import BackIcon from "@/components/icon/BackIcon";
import MoreIcon from "@/components/icon/MoreIcon";
import DetailTopBar from "@/components/share/DetailTopBar";

export default function LogDetailPage() {
  const { logId } = useParams();
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const qs = useSearchParams();

  const logQuery = useQuery({
    queryKey: ["drippin", "log", logId],
    queryFn: async () => {
      const { data } = await supabase
        .from("logs")
        .select(`*, profiles(handle, email), likes:logs_likes(*)`)
        .eq("id", logId)
        .eq("is_removed", false)
        .maybeSingle();
      return data;
    },
  });

  const deleteMutate = useMutation({
    mutationFn: async () => {
      const { data } = await supabase
        .from("logs")
        .update({ is_removed: true })
        .eq("id", logId)
        .maybeSingle()
        .throwOnError();

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drippin"] });
      router.back();
    },
    onError: (error) => {
      console.error(error);
      alert("로그 삭제에 실패했습니다.");
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

    if (!mySessionQuery.data?.session) {
      const isConfirm = confirm("로그인하시겠어요?");
      if (isConfirm) {
        router.push("/my");
      }
      return;
    }

    if (isLiked) {
      unlikeMutate.mutate();
    } else {
      likeMutate.mutate();
    }
  };

  const deleteLog = () => {
    if (!mySessionQuery.data?.session) {
      const isConfirm = confirm("로그인하시겠어요?");
      if (isConfirm) {
        router.push("/my");
      }
      return;
    }

    const deleteConfirm = confirm("정말로 삭제하시겠어요?");
    if (!deleteConfirm) return;

    deleteMutate.mutate();
  };

  if (logQuery.isLoading) return <Spinner />;

  return (
    <div className="flex flex-col">
      <DetailTopBar
        showMoreOptions={
          mySessionQuery.data?.session?.user.id === logQuery.data?.user_id
        }
        deleteAction={deleteLog}
      />

      <div className="flex flex-col gap-2">
        {logQuery.data?.image_url ? (
          <div className="relative w-full aspect-[1/1]">
            <Image
              src={logQuery.data?.image_url}
              alt="log"
              className="w-full h-full object-cover"
              fill
            />
          </div>
        ) : (
          <DefaultThumbnail
            title={`${logQuery.data?.coffee_place}에서 마신 ${logQuery.data?.coffee_name}`}
            handle={logQuery.data?.profiles?.handle || ""}
          />
        )}

        <div className="flex flex-col px-3 py-3 gap-3">
          <div className="flex items-center gap-[6px] text-sm font-regular">
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

          <div className="text-[#1E1E1E] text-base">
            <span className="text-[#757575]">
              @{logQuery.data?.profiles?.handle}
            </span>{" "}
            <div
              dangerouslySetInnerHTML={{
                __html: logQuery.data?.content?.replace(/\n/g, "<br/>") || "",
              }}
            />
          </div>

          <div className="mt-1 text-sm">
            {logQuery.data?.tags?.split(" ").join(" ")}
          </div>

          <div className="mt-1 text-sm text-[#757575]">
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
