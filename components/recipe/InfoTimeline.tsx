import { brewOptions } from "@/constants/brew";
import { BrewOption, BrewingInfo } from "@/types/brew";
import { cn } from "@/utils/cn";
import { secToTime } from "@/utils/utils";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Select from "react-select";

interface InfoTimelineProps {
  hasPrev: boolean;
  hasNext: boolean;
  label: string;
  order: number;
  phase: BrewingInfo;
  allInfo: BrewingInfo[];
  setInfoAction: Dispatch<SetStateAction<BrewingInfo[]>>;
  setCurrentPageAction: Dispatch<SetStateAction<number>>;
}

export default function InfoTimeline({
  hasPrev,
  hasNext,
  label,
  order,
  phase,
  allInfo,
  setInfoAction,
  setCurrentPageAction,
}: InfoTimelineProps) {
  const [totalWater, setTotalWater] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  const [water, setWater] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [brewOption, setBrewOption] = useState<BrewOption[]>([]);
  const [memo, setMemo] = useState<string>("");

  const onChangeWater = (e: React.ChangeEvent<HTMLInputElement>) => {
    const convert = Number(e.target.value);
    if (isNaN(convert)) {
      setWater(0);
    } else {
      setWater(convert);
    }
  };

  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const convert = Number(e.target.value);
    if (isNaN(convert)) {
      setTime(0);
    } else {
      setTime(convert);
    }
  };

  const openModal = () => {
    const modal = document.getElementById(
      `modal-${label}-${order}`,
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const onChangeMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(e.target.value);
  };

  const handleApply = () => {
    setInfoAction((prev) => {
      return prev.map((item) => {
        if (item.order === phase.order) {
          return {
            ...item,
            water,
            time,
            brewOption,
            memo,
          };
        }
        return item;
      });
    });
  };

  // 이전 단계 모두의 물 양과 시간을 더해서 현재 단계의 물 양과 시간을 설정
  const getAllBeforeWater = () => {
    const beforeInfo = allInfo.filter(
      (item) => item.order < phase.order && item.water !== null,
    );
    const totalWater = beforeInfo.reduce(
      (acc, item) => acc + (item.water || 0),
      0,
    );
    const totalTime = beforeInfo.reduce(
      (acc, item) => acc + (item.time || 0),
      0,
    );
    setTotalWater(totalWater + water);
    setTotalTime(totalTime + time);
  };

  const moveToNextPage = () => {
    setCurrentPageAction((prev) => prev + 1);
  };

  useEffect(() => {
    getAllBeforeWater();
  }, [allInfo, water, time]);

  useEffect(() => {
    setWater(phase.water || 0);
    setTime(phase.time || 0);
    setBrewOption(phase.brewOption || []);
    setMemo(phase.memo || "");

    return () => {
      setWater(0);
      setTime(0);
      setBrewOption([]);
      setMemo("");
    };
  }, [phase]);

  const isFillPrevWaterAndTime = () => {
    const filtered = allInfo.filter(
      (value) => (!value.water || !value.time) && value.order < phase.order,
    );
    return filtered.length === 0;
  };

  return (
    <React.Fragment>
      <li
        onClick={hasNext ? openModal : moveToNextPage}
        className="cursor-pointer"
      >
        {hasPrev && <hr className={cn(true ? "bg-primary" : "")} />}
        <div className="timeline-middle px-[10px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#1E1E1E" />
          </svg>
        </div>
        {hasNext ? (
          <div className={cn("label-text timeline-start text-xs")}>{label}</div>
        ) : (
          <div
            className={cn(
              "label-text timeline-start",
              isFillPrevWaterAndTime()
                ? "text-rose-500 font-bold"
                : "text-gray-200",
            )}
          >
            {label}
          </div>
        )}

        {hasNext && (
          <div
            className={cn(
              "timeline-box bg-[#F0F0F0] label-text timeline-end p-[10px] border-none rounded-lg text-xs",
              (water === 0 || time === 0) && hasPrev
                ? "text-gray-200"
                : "text-gray-900",
            )}
          >
            {totalWater}g/{secToTime(totalTime)}
          </div>
        )}

        {hasNext && <hr className={cn(true ? "bg-primary" : "")} />}
      </li>

      <dialog
        id={`modal-${label}-${order}`}
        className="modal max-w-none max-h-none "
      >
        <div className="modal-box h-full">
          <h3 className="font-bold text-lg">{label}</h3>

          <div className="flex flex-col gap-2">
            {hasNext ? (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text text-base">
                        물을 몇 그램 부었나요?
                        <span className="text-red-500 px-1">*</span>
                      </span>
                    </div>
                    <input
                      type="text"
                      value={water?.toString() ?? ""}
                      onChange={onChangeWater}
                      className="input input-bordered w-full max-h-10"
                    />
                  </label>
                </div>
                <div>
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text text-base">
                        다음 푸어까지 몇 초 동안 소요되나요?
                        <span className="text-red-500 px-1">*</span>
                      </span>
                    </div>
                    <input
                      type="text"
                      value={time?.toString() ?? ""}
                      onChange={onChangeTime}
                      className="input input-bordered w-full max-h-10"
                    />
                  </label>
                </div>
                <div>
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text text-base">
                        추출 옵션을 선택해주세요.
                      </span>
                    </div>
                    <Select
                      isMulti
                      name="brewOption"
                      options={brewOptions}
                      className="basic-multi-select z-50 label-text"
                      classNamePrefix="select"
                      onChange={(e) => {
                        setBrewOption(e as BrewOption[]);
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label className="form-control w-full">
                    <label>
                      <span className="label-text text-base">
                        {`메모를 남겨주세요. (${memo.length}/100)`}
                      </span>

                      <input
                        type="text"
                        placeholder="메모"
                        className="input input-bordered w-full max-h-10 mt-2"
                        value={memo}
                        maxLength={100}
                        onChange={onChangeMemo}
                      />
                    </label>
                  </label>
                </div>

                <div className="flex flex-row gap-2">
                  <form method="dialog" className="flex-1">
                    <button className="btn bg-[#FFFFFF] text-[#1E1E1E] border-[#2C2C2C] w-full">
                      취소
                    </button>
                  </form>
                  <form method="dialog" className="flex-1">
                    <button
                      className="btn bg-[#2C2C2C] text-[#F5F5F5] w-full"
                      onClick={handleApply}
                    >
                      적용하기
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div>추출완료 전용</div>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </React.Fragment>
  );
}
