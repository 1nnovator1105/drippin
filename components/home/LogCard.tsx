import Image from "next/image";
import LikeIcon from "../icon/LikeIcon";
import TagChip from "../share/TagChip";
import { Tables } from "@/types/database.types";
import DefaultThumbnail from "../share/DefaultThumbnail";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface Props {
  log: Tables<"logs">;
  summary?: boolean;
}

export default function LogCard({ log, summary }: Props) {
  const supabase = useSupabaseBrowser();

  const queryClient = useQueryClient();

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
        log_id: log.id,
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
        .eq("log_id", log.id)
        .eq("from_user_id", mySessionQuery.data?.session?.user.id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drippin"] });
    },
  });

  const isLiked = log?.likes?.some(
    (like) => like.from_user_id === mySessionQuery.data?.session?.user.id,
  );

  const conditionLikeAction = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!mySessionQuery.data?.session) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (isLiked) {
      unlikeMutate.mutate();
    } else {
      likeMutate.mutate();
    }
  };

  return (
    <Link href={`/log/${log.id}`} className="cursor-pointer w-full">
      <div>
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
                  alt="recipe"
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

          <div className="flex flex-col px-3 py-3 gap-3">
            {!summary && (
              <div className="flex items-center gap-[6px]">
                <div onClick={conditionLikeAction}>
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
                <div className="flex font-bold">
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

            <div className="line-clamp-3 text-gray-900">
              <span className="text-gray-500">@{log.profiles?.handle}</span>{" "}
              {log.content}
            </div>

            <div>{log.tags?.split(" ").join(" ")}</div>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-gray-100"></div>
    </Link>
  );
}
