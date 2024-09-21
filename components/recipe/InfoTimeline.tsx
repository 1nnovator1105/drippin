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

  useEffect(() => {
    console.log(water, time);
  }, [water, time]);

  return (
    <React.Fragment>
      <li onClick={openModal} className="cursor-pointer">
        {hasPrev && <hr className={cn(true ? "bg-primary" : "")} />}
        <div className="timeline-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="text-primary h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div
          className={cn(
            "timeline-box label-text",
            order % 2 === 0 ? "timeline-start" : "timeline-end",
          )}
        >
          {label}
        </div>

        {hasNext && (
          <div
            className={cn(
              "label-text",
              order % 2 === 0 ? "timeline-end" : "timeline-start",
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

          <div className="flex flex-col gap-2 py-4">
            {hasNext ? (
              <>
                <div>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">
                        몇 그램의 물을 부을까요?
                      </span>
                    </div>
                    <input
                      type="text"
                      value={water?.toString() ?? ""}
                      onChange={onChangeWater}
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                </div>
                <div>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">몇 초동안 부을까요?</span>
                    </div>
                    <input
                      type="text"
                      value={time?.toString() ?? ""}
                      onChange={onChangeTime}
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                </div>
                <div>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">(선택) 추출 옵션</span>
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
                  <input
                    type="text"
                    placeholder="메모가 있다면 적어주세요. (100자 이내)"
                    className="input input-ghost w-full max-w-xs border-none focus:outline-none px-1 focus:text-gray-400"
                    value={memo}
                    maxLength={100}
                    onChange={onChangeMemo}
                  />
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
