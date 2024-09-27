"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import CountdownTimer from "@/components/recipe/CountdownTimer";
import { cn } from "@/utils/cn";

// recipe/[recipeId]
export default function RecipeTimerPage() {
  const { recipeId } = useParams();
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const swiperRef = useRef(null);

  const [tryCount, setTryCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [brewingInfo, setBrewingInfo] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

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
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (activeIndex !== -1) {
      // @ts-ignore
      swiperRef.current?.swiper.slideTo(activeIndex);
    }
  }, [activeIndex]);

  useEffect(() => {
    if (brewingInfo.length === 0 && recipeQuery.data) {
      setBrewingInfo(
        JSON.parse(JSON.stringify(recipeQuery.data.raw_brewing_info)),
      );
    }
  }, [recipeQuery.data]);

  return (
    <>
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

      <div className="mt-[30px]">
        <Swiper
          ref={swiperRef}
          spaceBetween={30}
          centeredSlides={true}
          pagination={{
            clickable: false,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {brewingInfo.map((value: any, index: number) => (
            <SwiperSlide key={index}>
              <CountdownTimer
                value={value}
                index={index}
                tryCount={tryCount}
                onComplete={() => {
                  setActiveIndex((prev) => prev + 1);
                }}
                isPlaying={activeIndex === index && isPlaying}
                isLast={index === brewingInfo.length - 1}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex flex-row gap-3 justify-center items-center px-4">
          {activeIndex !== brewingInfo.length - 1 ? (
            <button
              className="btn btn-neutral flex-1"
              onClick={() => {
                if (isPlaying) {
                  setIsPlaying(false);
                } else {
                  if (activeIndex === -1) {
                    setActiveIndex(0);
                  }
                  setIsPlaying(true);
                }
              }}
            >
              {isPlaying ? "정지하기" : "재생하기"}
            </button>
          ) : null}

          <button
            className={"btn flex-1"}
            onClick={() => {
              setActiveIndex(-1);
              setIsPlaying(false);
              setTryCount((prev) => prev + 1);
              // @ts-ignore
              swiperRef.current?.swiper.slideTo(0);
            }}
          >
            다시하기
          </button>
        </div>
      </div>
    </>
  );
}
