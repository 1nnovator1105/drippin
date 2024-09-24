"use client";

import Image from "next/image";
import LikeIcon from "../icon/LikeIcon";
import TagChip from "./TagChip";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { Database } from "@/types/database.types";
import { secToKoreanTime, secToTime } from "@/utils/utils";
import Link from "next/link";
import DefaultThumbnail from "./DefaultThumbnail";
import { useQuery } from "@tanstack/react-query";
import useSupabaseBrowser from "@/utils/supabase/client";

interface RecipeCardProps {
  recipe: Database["public"]["Tables"]["recipes"]["Row"];
  summary?: boolean;
}

export default function RecipeCard({ recipe, summary }: RecipeCardProps) {
  const supabase = useSupabaseBrowser();
  const [isActive, setIsActive] = useState(false);

  const mySessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
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

  return (
    <Link
      href={`/recipe/${recipe.id}`}
      scroll={false}
      className="cursor-pointer w-full select-none"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
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
              <div className="flex items-center gap-[6px]">
                <LikeIcon fill="#1E1E1E" stroke="#1E1E1E" strokeWidth="2.5" />
                <span>99명의 드리핀이 좋아해요</span>
              </div>
            )}

            <div className="flex font-bold">{recipe.recipe_name}</div>

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

              <div className="flex items-center gap-1">
                <LikeIcon
                  fill="#1E1E1E"
                  stroke="#1E1E1E"
                  strokeWidth="2.5"
                  className="size-4"
                />
                <span className="text-sm">99</span>
              </div>
            </div>

            <div className="line-clamp-3 text-gray-900">
              <span className="text-gray-500">@{recipe.profiles?.handle}</span>{" "}
              {recipe.recipe_description}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-gray-100"></div>
    </Link>
  );
}
