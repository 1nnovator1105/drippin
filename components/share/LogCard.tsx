import Image from "next/image";
import LikeIcon from "../icon/LikeIcon";
import TagChip from "./TagChip";
import { Tables } from "@/types/database.types";
import DefaultThumbnail from "./DefaultThumbnail";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSession from "@/hooks/useSession";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { usePathname, useRouter } from "next/navigation";
import { invalidateLogQueries } from "@/utils/invalidate";

interface Props {
  log: Tables<"logs">;
  summary?: boolean;
}

export default function LogCard({ log, summary }: Props) {
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const nowPageUrl = usePathname();

  const mySessionQuery = useSession();

  const likeMutate = useMutation({
    mutationFn: async () => {
      if (!mySessionQuery.data?.session) throw Error("세션이 필요합니다.");

      const { data, error } = await supabase.from("logs_likes").insert({
        log_id: log.id,
        from_user_id: mySessionQuery.data.session.user.id,
      });

      return data;
    },
    onSuccess: () => {
      invalidateLogQueries(queryClient);
    },
  });

  const unlikeMutate = useMutation({
    mutationFn: async () => {
      if (!mySessionQuery.data?.session) throw Error("세션이 필요합니다.");

      const { data, error } = await supabase
        .from("logs_likes")
        .delete()
        .eq("log_id", log.id)
        .eq("from_user_id", mySessionQuery.data?.session?.user.id);
      return data;
    },
    onSuccess: () => {
      invalidateLogQueries(queryClient);
    },
  });

  const isLiked = log?.likes?.some(
    (like) => like.from_user_id === mySessionQuery.data?.session?.user.id,
  );

  const conditionLikeAction = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
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

  const qs = nowPageUrl === "/" ? `?from=home` : "";

  return (
    <Link
      href={`/log/${log.id}${qs}`}
      className="block cursor-pointer w-full border-b border-stone-200"
      scroll={false}
    >
      <div className="flex flex-col">
          {!summary && (
            <div
              className={cn(
                "relative w-full",
                log?.image_url ? "aspect-[1/1]" : "h-[170px]",
              )}
            >
              {log?.image_url ? (
                <Image
                  src={log.image_url}
                  alt={`${log.coffee_place}에서 마신 ${log.coffee_name}`}
                  className="w-full h-full object-cover"
                  fill
                />
              ) : (
                <DefaultThumbnail
                  title={`${log.coffee_name} @${log.coffee_place}`}
                  handle={log.profiles?.handle || ""}
                />
              )}
            </div>
          )}

          <div
            className={cn(
              "flex px-3 py-3 gap-3",
              summary ? "flex-row items-start" : "flex-col",
            )}
          >
            {summary && log.image_url && (
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-stone-100">
                <Image
                  src={log.image_url}
                  alt={`${log.coffee_place}에서 마신 ${log.coffee_name}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-3 min-w-0 flex-1">
            {!summary && (
              <div className="flex text-foreground font-regular items-center gap-[6px] text-sm">
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                  aria-pressed={isLiked}
                  onClick={conditionLikeAction}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      conditionLikeAction(e);
                  }}
                >
                  <LikeIcon
                    fill={isLiked ? "#1E1E1E" : "#FFF"}
                    stroke={"#1E1E1E"}
                    strokeWidth="2.5"
                  />
                </div>
                <span>{log.likes?.length}명의 드리핀이 좋아해요</span>
              </div>
            )}

            {summary && (
              <div className="flex items-center justify-between">
                <div className="flex text-foreground font-bold">
                  {log.coffee_place}에서 마신 {log.coffee_name}
                </div>
                <div className="flex items-center gap-1">
                  <LikeIcon
                    fill="#1E1E1E"
                    stroke="#1E1E1E"
                    strokeWidth="2.5"
                    className="size-4"
                  />
                  <span className="text-sm">{log?.likes?.length}</span>
                </div>
              </div>
            )}

            <div
              className={cn(
                "text-base text-foreground font-regular",
                summary ? "line-clamp-2" : "line-clamp-3",
              )}
            >
              <span className="text-muted-foreground">@{log.profiles?.handle}</span>{" "}
              {log.content}
            </div>

            <div className="text-foreground text-base font-regular">
              {log.tags
                ?.split(" ")
                ?.map((value) => {
                  if (value.startsWith("#")) {
                    return value;
                  }

                  return `#${value}`;
                })
                ?.join(" ")}
            </div>
            </div>
          </div>
        </div>
    </Link>
  );
}
