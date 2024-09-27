"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CountdownCircleTimer,
  useCountdown,
} from "react-countdown-circle-timer";
// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import {
  ArrowLeft,
  PlayIcon,
  RefreshCcwIcon,
  StopCircleIcon,
} from "lucide-react";
import CountdownTimer from "@/components/recipe/CountdownTimer";

// recipe/[recipeId]
export default function RecipeTimerPage() {
  const { recipeId } = useParams();
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const swiperRef = useRef(null);
  const dropdownRef = useRef(null);

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

        {/* <details className="dropdown dropdown-end cursor-pointer">
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
                stroke-width="1.875"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 10.9375C10.5178 10.9375 10.9375 10.5178 10.9375 10C10.9375 9.48223 10.5178 9.0625 10 9.0625C9.48223 9.0625 9.0625 9.48223 9.0625 10C9.0625 10.5178 9.48223 10.9375 10 10.9375Z"
                stroke="#1E1E1E"
                stroke-width="1.875"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 17.8125C10.5178 17.8125 10.9375 17.3928 10.9375 16.875C10.9375 16.3572 10.5178 15.9375 10 15.9375C9.48223 15.9375 9.0625 16.3572 9.0625 16.875C9.0625 17.3928 9.48223 17.8125 10 17.8125Z"
                stroke="#1E1E1E"
                stroke-width="1.875"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box min-w-[83px] z-[1] p-3 shadow top-[30px] rounded-lg">
            <li className="text-center" onClick={deteRecipe}>
              삭제하기
            </li>
          </ul>
        </details> */}
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

        <div className="flex flex-row gap-3 justify-center items-center">
          <button
            className="btn btn-neutral"
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

          <button
            className="btn"
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
