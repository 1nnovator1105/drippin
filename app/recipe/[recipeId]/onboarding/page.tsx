"use client";

import BackIcon from "@/components/icon/BackIcon";
import DetailTopBar from "@/components/share/DetailTopBar";
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
    <>
      <div>
        <DetailTopBar showMoreOptions={false} />

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
                  <div className="label-text text-center mt-1">
                    커피의 양(g)
                  </div>
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
                  <div className="label-text text-center mt-1">
                    물의 온도(℃)
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="label">
                <p className="label-text">원두 분쇄도</p>
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
                  <span className="text-left">
                    곱게
                    <br />
                    <span className="text-[10px]">(~400μm)</span>
                  </span>
                  <span className="text-center">
                    약간 곱게
                    <br />
                    <span className="text-[10px]">(~600μm)</span>
                  </span>
                  <span className="text-center">
                    보통
                    <br />
                    <span className="text-[10px]">(~800μm)</span>
                  </span>
                  <span className="text-center">
                    약간 굵게
                    <br />
                    <span className="text-[10px]">(~1000μm)</span>
                  </span>
                  <span className="text-right">
                    굵게
                    <br />
                    <span className="text-[10px]">(~1400μm)</span>
                  </span>
                </div>

                <div className="mt-[30px]">
                  <label className="form-control w-full">
                    <div className="label flex flex-col items-start justify-start">
                      <p className="label-text">메모</p>
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
      </div>
      <div className="fixed bottom-4 max-w-xl w-full px-4">
        <Link
          className="flex justify-center items-center"
          href={`/recipe/${recipeId}/timer`}
        >
          <button className="btn bg-[#2C2C2C] text-white w-full font-base">
            시작하기
          </button>
        </Link>
      </div>
    </>
  );
}
