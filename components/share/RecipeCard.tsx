"use client";

import Image from "next/image";
import LikeIcon from "../icon/LikeIcon";
import TagChip from "./TagChip";
import { Database } from "@/types/database.types";
import { secToKoreanTime } from "@/utils/utils";
import Link from "next/link";
import DefaultThumbnail from "./DefaultThumbnail";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSupabaseBrowser from "@/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";

interface RecipeCardProps {
  recipe: Database["public"]["Tables"]["recipes"]["Row"];
  summary?: boolean;
}

export default function RecipeCard({ recipe, summary }: RecipeCardProps) {
  const supabase = useSupabaseBrowser();
  const nowPageUrl = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mySessionQuery = useQuery({
    queryKey: ["drippin", "session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    },
  });

  const likeMutate = useMutation({
    mutationFn: async () => {
      if (!mySessionQuery.data?.session) throw Error("세션이 필요합니다.");

      const { data, error } = await supabase.from("recipes_likes").insert({
        recipe_id: recipe.id,
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
        .from("recipes_likes")
        .delete()
        .eq("recipe_id", recipe.id)
        .eq("from_user_id", mySessionQuery.data?.session?.user.id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drippin"] });
    },
  });

  const getTotalTime = () => {
    const jsonRawData = JSON.parse(JSON.stringify(recipe.raw_brewing_info));
    const totalTime = jsonRawData.reduce(
      (acc: number, cur: { time: number }) => {
        return acc + cur.time;
      },
      0,
    );

    return totalTime;
  };

  const myRecipe =
    mySessionQuery.data?.session?.user.id === recipe.profiles?.id;

  const isLiked = recipe?.likes?.some(
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

  const qs = nowPageUrl === "/" ? `?from=home` : "";

  return (
    <Link
      href={`/recipe/${recipe.id}${qs}`}
      scroll={false}
      className="cursor-pointer w-full select-none"
    >
      <div>
        <div className={"flex flex-col"}>
          {!summary && (
            <div className="relative w-full h-[170px]">
              {recipe?.image_url ? (
                <Image
                  src={recipe?.image_url}
                  alt="recipe"
                  className="w-full h-full object-cover"
                  fill
                />
              ) : (
                <DefaultThumbnail
                  title={recipe.recipe_name}
                  handle={recipe.profiles?.handle || ""}
                />
              )}
            </div>
          )}

          <div className="flex flex-col px-3 py-3 gap-3">
            {!summary && (
              <div className="flex text-[#1E1E1E] font-regular items-center gap-[6px] text-sm">
                <div onClick={conditionLikeAction}>
                  <LikeIcon
                    fill={isLiked ? "#1E1E1E" : "#FFF"}
                    stroke={"#1E1E1E"}
                    strokeWidth="2.5"
                  />
                </div>
                <span>{recipe?.likes?.length}명의 드리핀이 좋아해요</span>
              </div>
            )}

            <div className="flex font-bold text-base text-[#1E1E1E]">
              {recipe.recipe_name}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-row gap-2">
                <TagChip
                  label={`${secToKoreanTime(getTotalTime())}`}
                  className="text-black bg-[#CCC]"
                />
                {recipe.is_ice && (
                  <TagChip label="ICE" className="text-white bg-[#699BF7]" />
                )}
                {recipe.is_hot && (
                  <TagChip label="HOT" className="text-white bg-[#F24E1E]" />
                )}
              </div>

              {summary && (
                <div className="flex text-[#1E1E1E] items-center gap-1 text-sm">
                  <LikeIcon
                    fill="#1E1E1E"
                    stroke="#1E1E1E"
                    strokeWidth="2.5"
                    className="size-4"
                  />
                  <span className="text-sm">{recipe?.likes?.length}</span>
                </div>
              )}
            </div>

            <div className="line-clamp-3 text-[#1E1E1E] text-base">
              <span className="text-[#757575]">@{recipe.profiles?.handle}</span>{" "}
              {recipe.recipe_description}
            </div>

            <div className="text-[#757575] text-sm">
              {format(new Date(recipe.created_at), "yyyy년 M월 dd일")}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-gray-100"></div>
    </Link>
  );
}
