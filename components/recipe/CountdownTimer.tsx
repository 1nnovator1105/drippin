import { BrewingInfo } from "@/types/brew";
import { secToKoreanTime } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";
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
  brewingInfo: BrewingInfo[];
}
export default function CountdownTimer({
  value,
  index,
  tryCount,
  onComplete,
  isPlaying,
  isLast,
  brewingInfo,
}: CountdownTimerProps) {
  const [remainingTime, setRemainingTime] = useState(value.time ?? 0);

  const { remainingTime: countdownTime } = useCountdown({
    isPlaying: isPlaying,
    duration: value.time ?? 0,
    initialRemainingTime: value.time ?? 0,
    colors: "#A30000",
  });

  useEffect(() => {
    setRemainingTime(countdownTime);
  }, [countdownTime]);

  useEffect(() => {
    setRemainingTime(value.time ?? 0);
  }, [tryCount]);

  // brewingInfo의 현재 index까지의 누적 water값을 구하는 함수
  const getTotalWater = (index: number) => {
    return brewingInfo
      .slice(0, index + 1)
      .reduce((acc, cur) => acc + (cur.water ?? 0), 0);
  };

  const getTotalTime = (index: number) => {
    return brewingInfo
      .slice(0, index + 1)
      .reduce((acc, cur) => acc + (cur.time ?? 0), 0);
  };

  const children = ({ remainingTime }: { remainingTime: number }) => {
    return (
      <div className="text-base flex flex-col justify-center items-center text-center">
        <div>{value.label}</div>
        {!isLast && (
          <div className="text-sm text-gray-500">
            총 진행 시간: {secToKoreanTime(getTotalTime(index))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center py-10 flex-col">
      <div className="flex flex-col justify-center items-center text-2xl mb-[30px] mx-4 text-center">
        {!isLast ? (
          <>
            <div>{secToKoreanTime(remainingTime)} 동안</div>
            <div>
              {value.water}g의 물을 붓고 기다려주세요
              <br />
              (총 {getTotalWater(index)}g)
            </div>
          </>
        ) : (
          <div>추출이 완료되었어요!</div>
        )}
      </div>

      <CountdownCircleTimer
        key={`${index}-${tryCount}`}
        isPlaying={isPlaying}
        duration={value.time ?? 0}
        initialRemainingTime={value.time ?? 0}
        colors={["#EBA15B", "#C0844B", "#9E6C3E", "#7C5530"]}
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
      {value.memo && (
        <div className="mt-[30px] mx-8 text-center">“{value.memo}”</div>
      )}

      {value.brewOption && value.brewOption.length > 0 && (
        <div className="flex flex-row flex-wrap gap-[10px] justify-center items-center px-[60px] mt-[15px]">
          {value.brewOption?.map((option) => {
            return (
              <div
                key={`${index}-${tryCount}-${option.label}`}
                className="border-[1px] border-[#1E1E1E] rounded-2xl px-2 py-1"
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
