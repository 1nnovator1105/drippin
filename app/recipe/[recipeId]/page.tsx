"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
// Import Swiper React components

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import DefaultThumbnail from "@/components/share/DefaultThumbnail";
import Link from "next/link";
import { cn } from "@/utils/cn";
import RecipeCard from "@/components/share/RecipeCard";
import { Database } from "@/types/database.types";
import LikeIcon from "@/components/icon/LikeIcon";
import TagChip from "@/components/share/TagChip";
import { secToKoreanTime } from "@/utils/utils";

// recipe/[recipeId]
export default function RecipePage() {
  const { recipeId } = useParams();
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mySessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    },
  });

  const recipeQuery = useQuery({
    queryKey: ["drippin", "recipe", recipeId],
    queryFn: async () => {
      const { data } = await supabase
        .from("recipes")
        .select("*, profiles(handle, email), likes:recipes_likes(*)")
        .eq("id", recipeId)
        .maybeSingle();

      return data;
    },
  });

  const deleteMutate = useMutation({
    mutationFn: async () => {
      const { data } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeId)
        .maybeSingle();

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drippin"] });
      router.back();
    },
  });

  const likeMutate = useMutation({
    mutationFn: async () => {
      if (!mySessionQuery.data?.session) throw Error("세션이 필요합니다.");

      const { data, error } = await supabase.from("recipes_likes").insert({
        recipe_id: Number(recipeId),
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
        .eq("recipe_id", recipeId)
        .eq("from_user_id", mySessionQuery.data?.session?.user.id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drippin"] });
    },
  });

  const deteteRecipe = () => {
    if (!mySessionQuery.data?.session) {
      const isConfirm = confirm("로그인하시겠어요?");
      if (isConfirm) {
        router.push("/my");
      }
      return;
    }

    deleteMutate.mutate();
  };

  const getTotalTime = () => {
    const jsonRawData = JSON.parse(
      JSON.stringify(recipeQuery.data?.raw_brewing_info),
    );
    const totalTime = jsonRawData.reduce(
      (acc: number, cur: { time: number }) => {
        return acc + cur.time;
      },
      0,
    );

    return totalTime;
  };

  const isLiked = recipeQuery.data?.likes?.some(
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

  if (recipeQuery.isLoading) return <div>Loading...</div>;

  return (
    <div className="pb-[88px]">
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

        {mySessionQuery.data?.session?.user.id ===
          recipeQuery.data?.user_id && (
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
                  strokeWidth="1.875"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 10.9375C10.5178 10.9375 10.9375 10.5178 10.9375 10C10.9375 9.48223 10.5178 9.0625 10 9.0625C9.48223 9.0625 9.0625 9.48223 9.0625 10C9.0625 10.5178 9.48223 10.9375 10 10.9375Z"
                  stroke="#1E1E1E"
                  strokeWidth="1.875"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 17.8125C10.5178 17.8125 10.9375 17.3928 10.9375 16.875C10.9375 16.3572 10.5178 15.9375 10 15.9375C9.48223 15.9375 9.0625 16.3572 9.0625 16.875C9.0625 17.3928 9.48223 17.8125 10 17.8125Z"
                  stroke="#1E1E1E"
                  strokeWidth="1.875"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box min-w-[83px] z-[1] p-3 shadow top-[30px] rounded-lg">
              <li className="text-center" onClick={deteteRecipe}>
                삭제하기
              </li>
            </ul>
          </details>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <div
            className={cn(
              "relative w-full",
              recipeQuery.data?.image_url ? "aspect-[1/1]" : "h-[170px]",
            )}
          >
            {recipeQuery.data?.image_url ? (
              <Image
                src={recipeQuery.data?.image_url}
                alt="recipe image"
                fill
                className="object-cover"
              />
            ) : (
              <DefaultThumbnail
                title={recipeQuery.data?.recipe_name || ""}
                handle={recipeQuery.data?.profiles?.handle || ""}
              />
            )}
          </div>
          <Link
            href={`/recipe/${recipeId}/onboarding`}
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
                <g clip-path="url(#clip0_259_1149)">
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

            <div className="text-white">레시피 진행하기</div>
          </Link>
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
              {recipeQuery.data?.likes?.length || 0}명의 드리핀이 좋아해요
            </span>
          </div>

          <div className="flex font-bold">{recipeQuery.data?.recipe_name}</div>

          <div className="flex items-center justify-between">
            <div className="flex flex-row gap-2">
              <TagChip
                label={`${secToKoreanTime(getTotalTime())}`}
                className="text-black bg-[#CCC]"
              />
              {recipeQuery.data?.is_ice && (
                <TagChip label="ICE" className="text-white bg-[#699BF7]" />
              )}
              {recipeQuery.data?.is_hot && (
                <TagChip label="HOT" className="text-white bg-[#F24E1E]" />
              )}
            </div>
          </div>

          <div className="line-clamp-3 text-gray-900">
            <span className="text-gray-500">
              @{recipeQuery.data?.profiles?.handle}
            </span>{" "}
            {recipeQuery.data?.recipe_description}
          </div>
        </div>
      </div>
    </div>
  );
}
