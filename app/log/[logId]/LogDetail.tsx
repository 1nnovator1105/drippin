"use client";

import LikeIcon from "@/components/icon/LikeIcon";
import DefaultThumbnail from "@/components/share/DefaultThumbnail";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Spinner from "@/components/share/Spinner";
import DetailTopBar from "@/components/share/DetailTopBar";
import Link from "next/link";
import { logEvent } from "@amplitude/analytics-browser";
import events from "@/utils/events";

export default function LogDetail({ logId }: { logId: string }) {
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
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    },
    onError: (error) => {
      console.error(error);
      alert("로그 삭제에 실패했습니다.");
    },
  });

  const mySessionQuery = useQuery({
    queryKey: ["drippin", "session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data;
    },
  });

  const likeMutate = useMutation({
    mutationFn: async () => {
      if (!mySessionQuery.data?.session) throw Error("세션이 필요합니다.");

      const { data } = await supabase.from("logs_likes").insert({
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

      const { data } = await supabase
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

  const editLog = () => {
    if (!mySessionQuery.data?.session) {
      const isConfirm = confirm("로그인하시겠어요?");
      if (isConfirm) {
        router.push("/my");
      }
      return;
    }

    logEvent(events.clickEditLog);
    router.push(`/log/${logId}/edit`);
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
        editAction={editLog}
        deleteAction={deleteLog}
      />

      <div className="flex flex-col gap-2">
        <div>
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
          {logQuery.data?.recipe_id && (
            <Link
              href={`/recipe/${logQuery.data?.recipe_id}`}
              className="flex flex-row justify-center items-center bottom-0 left-0 w-full h-[50px] bg-[#2C2C2C] gap-2 cursor-pointer"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="size-6"
                >
                  <g clipPath="url(#clip0_259_1149)">
                    <path
                      d="M7.91669 12.9867V7.01339C7.91681 6.93865 7.93703 6.86532 7.97524 6.80109C8.01344 6.73685 8.06822 6.68408 8.13383 6.64829C8.19944 6.6125 8.27347 6.59502 8.34816 6.59768C8.42285 6.60033 8.49545 6.62303 8.55835 6.66339L13.205 9.64922C13.2639 9.68692 13.3123 9.73881 13.3458 9.80011C13.3793 9.86142 13.3969 9.93017 13.3969 10.0001C13.3969 10.0699 13.3793 10.1387 13.3458 10.2C13.3123 10.2613 13.2639 10.3132 13.205 10.3509L8.55835 13.3376C8.49545 13.3779 8.42285 13.4006 8.34816 13.4033C8.27347 13.4059 8.19944 13.3884 8.13383 13.3526C8.06822 13.3169 8.01344 13.2641 7.97524 13.1999C7.93703 13.1356 7.91681 13.0623 7.91669 12.9876V12.9867Z"
                      fill="white"
                    />
                    <path
                      d="M0.833313 10C0.833313 4.93754 4.93748 0.833374 9.99998 0.833374C15.0625 0.833374 19.1666 4.93754 19.1666 10C19.1666 15.0625 15.0625 19.1667 9.99998 19.1667C4.93748 19.1667 0.833313 15.0625 0.833313 10ZM9.99998 2.08337C7.90035 2.08337 5.88671 2.91745 4.40205 4.40211C2.91739 5.88677 2.08331 7.90041 2.08331 10C2.08331 12.0997 2.91739 14.1133 4.40205 15.598C5.88671 17.0826 7.90035 17.9167 9.99998 17.9167C12.0996 17.9167 14.1132 17.0826 15.5979 15.598C17.0826 14.1133 17.9166 12.0997 17.9166 10C17.9166 7.90041 17.0826 5.88677 15.5979 4.40211C14.1132 2.91745 12.0996 2.08337 9.99998 2.08337Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_259_1149">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              <div className="text-white">레시피 보러가기</div>
            </Link>
          )}
        </div>

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
            {logQuery.data?.tags
              ?.split(" ")
              ?.map((value) => {
                if (value.startsWith("#")) {
                  return value;
                }

                return `#${value}`;
              })
              ?.join(" ")}
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
