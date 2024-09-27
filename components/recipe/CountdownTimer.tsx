import { BrewingInfo } from "@/types/brew";
import { useEffect } from "react";
import {
  CountdownCircleTimer,
  useCountdown,
} from "react-countdown-circle-timer";

interface CountdownTimerProps {
  value: BrewingInfo;
  index: number;
  tryCount: number;
  onComplete: () => void;
  isPlaying: boolean;
  isLast?: boolean;
}
export default function CountdownTimer({
  value,
  index,
  tryCount,
  onComplete,
  isPlaying,
  isLast,
}: CountdownTimerProps) {
  const { remainingTime } = useCountdown({
    isPlaying: isPlaying,
    duration: value.time ?? 0,
    initialRemainingTime: value.time ?? 0,
    colors: "#A30000",
  });

  const children = ({ remainingTime }: { remainingTime: number }) => {
    return <div className="text-base">{value.label}</div>;
  };

  return (
    <div className="flex justify-center items-center py-10 flex-col">
      {!isLast && (
        <div className="flex flex-col justify-center items-center text-2xl mb-[30px]">
          <div>{remainingTime}초 동안</div>
          <div>{value.water}g의 물을 붓고 기다려주세요</div>
        </div>
      )}
      <CountdownCircleTimer
        key={`${index}-${tryCount}`}
        isPlaying={isPlaying}
        duration={value.time ?? 0}
        initialRemainingTime={value.time ?? 0}
        colors={["#00a323", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[
          value?.time ?? 0,
          (value?.time ?? 0) / 2,
          (value?.time ?? 0) / 3,
          0,
        ]}
        onComplete={onComplete}
      >
        {children}
      </CountdownCircleTimer>
      {value.memo && <div className="mt-[30px]">“{value.memo}”</div>}

      <div className="flex flex-row flex-wrap gap-[10px] justify-center items-center px-[60px] mt-[15px]">
        {value.brewOption?.map((option) => {
          return (
            <div className="border-[1px] border-[#1E1E1E] rounded-2xl px-2 py-1">
              {option.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
