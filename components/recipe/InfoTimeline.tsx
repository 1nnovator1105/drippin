import { brewOptions } from "@/constants/brew";
import { BrewOption, BrewingInfo } from "@/types/brew";
import { cn } from "@/utils/cn";

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
}

export default function InfoTimeline({
  hasPrev,
  hasNext,
  label,
  order,
  phase,
  allInfo,
  setInfoAction,
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

  // sec to mm:ss
  const secToTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

  return (
    <React.Fragment>
      <li onClick={hasNext ? openModal : undefined} className="cursor-pointer">
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
        <div className={cn("label-text timeline-start")}>{label}</div>

        {hasNext && (
          <div
            className={cn(
              "timeline-box bg-[#F0F0F0] label-text timeline-end p-[10px] border-none rounded-lg text-gray-900",
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
              <>
                <div>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">물을 몇 그램 부었나요?</span>
                    </div>
                    <input
                      type="text"
                      value={water?.toString() ?? ""}
                      onChange={onChangeWater}
                      className="input input-bordered w-full max-w-xs max-h-10"
                    />
                  </label>
                </div>
                <div>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">
                        물을 붓고 다음 푸어까지 얼마나 기다릴까요?
                      </span>
                    </div>
                    <input
                      type="text"
                      value={time?.toString() ?? ""}
                      onChange={onChangeTime}
                      className="input input-bordered w-full max-w-xs max-h-10"
                    />
                  </label>
                </div>
                <div>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">
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

                  <label>
                    <span className="label-text">
                      {`메모를 남겨주세요. (${memo.length}/100)`}
                    </span>

                    <input
                      type="text"
                      placeholder="메모"
                      className="input input-ghost w-full max-w-xs border-none focus:outline-none px-1 focus:text-gray-400"
                      value={memo}
                      maxLength={100}
                      onChange={onChangeMemo}
                    />
                  </label>
                </div>
              </>
            ) : (
              <div>추출완료 전용</div>
            )}

            <div className="flex flex-row gap-2">
              <form method="dialog" className="flex-1">
                <button className="btn btn-warning w-full">취소</button>
              </form>
              <form method="dialog" className="flex-1">
                <button
                  className="btn btn-primary w-full"
                  onClick={handleApply}
                >
                  적용하기
                </button>
              </form>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </React.Fragment>
  );
}
