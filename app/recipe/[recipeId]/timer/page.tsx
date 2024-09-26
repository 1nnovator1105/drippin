"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
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

// recipe/[recipeId]
export default function RecipeTimerPage() {
  const { recipeId } = useParams();
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const swiper = useSwiper();
  const swiperRef = useRef(null);

  const [tryCount, setTryCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [brewingInfo, setBrewingInfo] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const recipeQuery = useQuery({
    queryKey: ["drippin", "recipe", recipeId],
    queryFn: async () => {
      const { data, error } = await supabase
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

  const children = ({ remainingTime }: { remainingTime: number }) => (
    <div
      role="timer"
      aria-live="assertive"
      className="flex flex-col justify-center items-center"
    >
      <div>다음 푸어까지</div>
      <div>{remainingTime} seconds</div>
    </div>
  );

  useEffect(() => {
    if (brewingInfo.length === 0 && recipeQuery.data) {
      setBrewingInfo(
        JSON.parse(JSON.stringify(recipeQuery.data.raw_brewing_info)),
      );
    }
  }, [recipeQuery.data]);

  return (
    <>
      <div className="sticky top-0 flex flex-row gap-2 items-center text-xl font-bold z-[50] bg-white">
        <ArrowLeft className="size-8" onClick={() => router.back()} />
        {recipeQuery.data?.recipe_name}
      </div>

      <div className="mt-2">
        <Swiper
          ref={swiperRef}
          spaceBetween={30}
          centeredSlides={true}
          // autoplay={{
          //   delay: 2500,
          //   disableOnInteraction: false,
          // }}
          // allowSlideNext={false}
          // allowSlidePrev={false}
          pagination={{
            clickable: false,
          }}
          // navigation={true}
          // onSlideChange={(swiper) => {
          //   console.log("slide change");
          //   setActiveIndex(swiper.activeIndex);
          // }}
          // onSlidesUpdated={(swiper) => {
          //   console.log("slides updated");
          // }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {brewingInfo.map((value: any, index: number) => (
            <SwiperSlide key={index}>
              <div className="flex justify-center items-center py-10 flex-col gap-3">
                <div>{value.label}</div>
                <CountdownCircleTimer
                  key={`${index}-${tryCount}`}
                  isPlaying={activeIndex === index && isPlaying}
                  duration={value.time}
                  initialRemainingTime={value.time}
                  colors="#A30000"
                  onComplete={() => {
                    setActiveIndex((prev) => prev + 1);
                  }}
                >
                  {children}
                </CountdownCircleTimer>
                <div>붓는 물의 양: {value.water}g</div>
                <div>{value.memo}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex flex-row gap-3 justify-center items-center mt-10">
          {/* play button icon */}
          <PlayIcon
            className="size-8"
            onClick={() => {
              setActiveIndex(0);
              setIsPlaying(true);
            }}
          />
          {/* stop button icon */}
          <StopCircleIcon
            className="size-8"
            onClick={() => {
              setActiveIndex(-1);
              setIsPlaying(false);
            }}
          />
          {/* refresh button icon */}
          <RefreshCcwIcon
            className="size-8"
            onClick={() => {
              setActiveIndex(-1);
              setIsPlaying(false);
              setTryCount((prev) => prev + 1);
              // @ts-ignore
              swiperRef.current?.swiper.slideTo(0);
            }}
          />
        </div>
      </div>
    </>
  );
}
