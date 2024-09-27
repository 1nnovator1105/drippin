"use client";

import { Input } from "@/components/ui/input";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function RecipeOnboardingPage({}) {
  const { recipeId } = useParams();
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const recipeQuery = useQuery({
    queryKey: ["drippin", "recipe", recipeId],
    queryFn: async () => {
      const { data } = await supabase
        .from("recipes")
        .select("*, profiles(handle, email)")
        .eq("id", recipeId)
        .maybeSingle();

      return data;
    },
  });

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
      </div>

      <div className="flex flex-col px-4">
        <label className="form-control w-full">
          <div className="label flex flex-col items-start justify-start">
            <p className="label-text">사용한 드리퍼</p>
          </div>
          <input
            type="text"
            className="input input-bordered w-full focus:outline-none max-h-[40px]"
            value={recipeQuery.data?.use_dripper}
            readOnly
          />
        </label>

        <label className="form-control w-full">
          <div className="label flex flex-col items-start justify-start">
            <p className="label-text">사용한 필터</p>
          </div>
          <input
            type="text"
            className="input input-bordered w-full focus:outline-none max-h-[40px]"
            value={recipeQuery.data?.use_filter}
            readOnly
          />
        </label>

        <div className="mt-8">
          <div>
            <div className="label">
              <p className="label-text">커피와 물의 비율</p>
            </div>
            <div className="flex w-full">
              <div>
                <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={recipeQuery.data?.coffee_amount ?? ""}
                    readOnly
                  />
                </div>
                <div className="label-text text-center mt-1">커피의 양(g)</div>
              </div>

              <div className="justify-center items-center flex h-20 min-w-[40px] px-[11px]">
                1:
                {(
                  Number(recipeQuery.data?.water_amount) /
                  Number(recipeQuery.data?.coffee_amount)
                )
                  .toFixed(1)
                  .replace(/\.0$/, "")}
              </div>

              <div>
                <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={recipeQuery.data?.water_amount ?? ""}
                    readOnly
                  />
                </div>
                <div className="label-text text-center mt-1">물의 양(g)</div>
              </div>

              <div>
                <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={recipeQuery.data?.water_temperature ?? ""}
                    readOnly
                  />
                </div>
                <div className="label-text text-center mt-1">물의 온도(℃)</div>
              </div>
            </div>
          </div>

          <div>
            <div className="label">
              <p className="label-text">원두 분쇄도를 알려주세요.</p>
            </div>
            <div>
              <input
                type="range"
                min={0}
                max="100"
                value={recipeQuery.data?.grind_step ?? ""}
                className="range [&::-webkit-slider-thumb]:bg-[#1F2937]"
                step="25"
                readOnly
              />
              <div className="flex w-full justify-between px-2 text-xs">
                <span>아주 곱게</span>
                <span>곱게</span>
                <span>보통</span>
                <span>굵게</span>
                <span>아주 굵게</span>
              </div>

              <div className="mt-[30px]">
                <label className="form-control w-full">
                  <div className="label flex flex-col items-start justify-start">
                    <p className="label-text">메모를 남겨주세요.</p>
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:outline-none max-h-[40px]"
                    value={recipeQuery.data?.grind_step_memo ?? ""}
                    readOnly
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[88px] w-full px-4">
        <Link
          className="flex justify-center items-center"
          href={`/recipe/${recipeId}/timer`}
        >
          <button className="btn bg-[#2C2C2C] text-white w-full font-base">
            시작하기
          </button>
        </Link>
      </div>
    </div>
  );
}
