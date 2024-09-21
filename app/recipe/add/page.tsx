"use client";

import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

import CreatableSelector from "@/components/recipe/CreatableSelector";
import { SelectorOption, createOption } from "@/utils/selector";
import { Input } from "@/components/ui/input";
import InfoTimeline from "@/components/recipe/InfoTimeline";
import { BrewingInfo } from "@/types/brew";

export default function RecipeAddPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const [isIceRecipe, setIsIceRecipe] = useState(false);
  const [isHotRecipe, setIsHotRecipe] = useState(false);

  const [recipeName, setRecipeName] = useState("");
  const [dripper, setDripper] = useState<SelectorOption | null>(null);
  const [filter, setFilter] = useState<SelectorOption | null>(null);

  const [grindStep, setGrindStep] = useState<number>(50);
  const [grindStepMemo, setGrindStepMemo] = useState<string>("");

  const [coffeeAmount, setCoffeeAmount] = useState<string>("");
  const [waterAmount, setWaterAmount] = useState<string>("");
  const [waterTemperature, setWaterTemperature] = useState<string>("");

  const [isNoBloom, setIsNoBloom] = useState<boolean>(false);
  const [pourCount, setPourCount] = useState<number>(1);

  const [brewingInfo, setBrewingInfo] = useState<BrewingInfo[]>([]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const scrollPosition = container.scrollTop;
    const pageHeight = container.clientHeight;

    const newPage = Math.ceil(scrollPosition / pageHeight) + 1;
    setCurrentPage(newPage);
  };

  const onChangeRecipeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipeName(e.target.value);
  };

  const onChangeGrindStep = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrindStep(Number(e.target.value));
  };

  const onChangeGrindStepMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrindStepMemo(e.target.value);
  };

  const onChangeCoffeeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoffeeAmount(e.target.value);
  };

  const onChangeWaterAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWaterAmount(e.target.value);
  };

  const onChangeWaterTemperature = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWaterTemperature(e.target.value);
  };

  const onChangePourCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPourCount(Number(e.target.value));
  };

  const defaultDripperOptions = [
    createOption("Hario V60"),
    createOption("Chemex"),
    createOption("Kalita"),
  ];

  const defaultFilterOptions = [
    createOption("Hario V60 Filter"),
    createOption("Chemex Filter"),
    createOption("Kalita Filter"),
  ];

  const showRatio =
    waterAmount &&
    Number(waterAmount) > 0 &&
    coffeeAmount &&
    Number(coffeeAmount) > 0;

  const makebrewingInfo = (isNoBloom: boolean, pourCount: number) => {
    let first = isNoBloom ? null : "블루밍(뜸들이기)";

    let newBrewingInfo: string[] = [];

    for (let i = 0; i < pourCount; i++) {
      if (first && i === 0) {
        newBrewingInfo.push(first);
      }
      newBrewingInfo.push(`${i + 1}차 추출`);
      if (i === pourCount - 1) {
        newBrewingInfo.push("추출 완료");
      }
    }

    setBrewingInfo((prevInfo) => {
      return newBrewingInfo.map((value, index) => {
        const existingInfo = prevInfo.find((info) => info.label === value);
        return {
          label: value,
          order: index,
          water: existingInfo?.water || null,
          time: existingInfo?.time || null,
          brewOption: existingInfo?.brewOption || null,
          memo: existingInfo?.memo || null,
          isConfirm: existingInfo?.isConfirm || false,
        };
      });
    });
  };

  useEffect(() => {
    makebrewingInfo(isNoBloom, pourCount);
  }, [isNoBloom, pourCount]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-none justify-center items-center">
        <ul className="steps">
          <li
            className={cn("step text-xs", currentPage >= 1 && "step-primary")}
          >
            Register
          </li>
          <li
            className={cn("step text-xs", currentPage >= 2 && "step-primary")}
          >
            Choose plan
          </li>
          <li
            className={cn("step text-xs", currentPage >= 3 && "step-primary")}
          >
            Purchase
          </li>
          <li
            className={cn("step text-xs", currentPage >= 4 && "step-primary")}
          >
            Receive Product
          </li>
        </ul>
      </div>
      <div className="flex flex-1 p-4">
        <div
          className="carousel carousel-vertical h-full w-full"
          onScroll={handleScroll}
        >
          {/* 1번 페이지 */}
          <div className="carousel-item flex flex-col h-full w-full gap-4">
            {/* 나는 1번 페이지 {currentPage === 1 && "(현재 페이지)"} */}
            <div>
              <label className="form-control w-full max-w-xs">
                <div className="label flex justify-between items-center">
                  <p className="label-text">레시피 이름이 뭔가요?</p>
                  <p className="label-text-alt text-xs text-gray-500">
                    레시피는 드립커피 추출방법을 말해요.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs focus:outline-none"
                  value={recipeName}
                  onChange={onChangeRecipeName}
                />
                {/* <div className="label">
                {!recipeName && (
                  <span className="label-text-alt">
                    레시피 이름을 입력해주세요.
                  </span>
                )}
                
              </div> */}
              </label>
            </div>

            <div>
              <label className={"form-control w-full max-w-xs"}>
                <div className="label flex justify-between items-center">
                  <p className="label-text">사용한 드리퍼는 어떤건가요?</p>
                  {/* <p className="label-text-alt text-xs text-gray-500">
                  레시피는 드립커피 추출방법을 말해요.
                </p> */}
                </div>
                <CreatableSelector
                  value={dripper}
                  setValue={setDripper}
                  defaultOptions={defaultDripperOptions}
                />
              </label>
            </div>

            <div>
              <label className={"form-control w-full max-w-xs"}>
                <div className="label flex justify-between items-center">
                  <p className="label-text">사용한 필터는 어떤건가요?</p>
                </div>
                <CreatableSelector
                  value={filter}
                  setValue={setFilter}
                  defaultOptions={defaultFilterOptions}
                />
              </label>
            </div>

            <label className="max-w-xs">
              <div className="label flex justify-between items-center">
                <p className="label-text">어떤 온도에 잘 어울리나요?</p>
              </div>

              <div className="flex flex-row gap-2">
                <div className="form-control">
                  <label className="label cursor-pointer flex flex-row gap-2">
                    <span className="label-text">🧊아이스</span>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={isIceRecipe}
                      onChange={() => setIsIceRecipe(!isIceRecipe)}
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer flex flex-row gap-2">
                    <span className="label-text">☀️핫</span>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={isHotRecipe}
                      onChange={() => setIsHotRecipe(!isHotRecipe)}
                    />
                  </label>
                </div>
              </div>
            </label>

            {/* <div className="flex justify-start mt-4"> 
              <button
                className="btn btn-primary self-end"
                onClick={() => {
                  // logging 1 page data
                  console.log({
                    recipeName,
                    dripper,
                    filter,
                  });

                  // scroll next page
                  const nextPage = document.querySelector(
                    ".carousel-item:nth-child(2)",
                  );
                  if (nextPage) {
                    nextPage.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                다음
              </button>
            </div> */}
          </div>

          {/* 2번 페이지 */}
          <div className="carousel-item flex flex-col h-full w-full">
            <div>
              <div className="label">
                <p className="label-text">커피와 물의 비율을 알려주세요</p>
              </div>
              <div className="flex w-full">
                <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
                  {/* <input
                    type="text"
                    placeholder="커피의 양(g)"
                    className="input input-ghost border-none focus:outline-none bg-base-300 text-center"
                    value={coffeeAmount ?? ""}
                    onChange={onChangeCoffeeAmount}
                  /> */}
                  <Input
                    type="text"
                    placeholder="커피의 양(g)"
                    className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={coffeeAmount ?? ""}
                    onChange={onChangeCoffeeAmount}
                  />
                </div>
                <div className="divider divider-horizontal">
                  {showRatio &&
                    `1:${(Number(waterAmount) / Number(coffeeAmount)).toFixed(1)}`}
                </div>
                <div className="card bg-base-300 rounded-box grid grid-cols-2 h-20 flex-grow place-items-center">
                  <Input
                    type="text"
                    placeholder="물의 양(g)"
                    className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={waterAmount ?? ""}
                    onChange={onChangeWaterAmount}
                  />
                  <Input
                    type="text"
                    placeholder="물의 온도(℃)"
                    className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={waterTemperature ?? ""}
                    onChange={onChangeWaterTemperature}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="label">
                <p className="label-text">원두 분쇄도를 알려주세요</p>
              </div>
              <div>
                <input
                  type="range"
                  min={0}
                  max="100"
                  value={grindStep}
                  className="range"
                  step="25"
                  onChange={onChangeGrindStep}
                />
                <div className="flex w-full justify-between px-2 text-xs">
                  <span>아주 곱게</span>
                  <span>곱게</span>
                  <span>보통</span>
                  <span>굵게</span>
                  <span>아주 굵게</span>
                </div>
                <div className="flex flex-row items-center pl-2">
                  <div className="flex items-center">
                    <svg
                      width="12px"
                      height="12px"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 16H11L16 11L11 6H10V10H4V1H2V12H10V16Z"
                        fill="#000000"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="메모가 있다면 적어주세요. ex) ek43 기준"
                    className="input input-ghost w-full max-w-xs border-none focus:outline-none px-1 focus:text-gray-400"
                    value={grindStepMemo}
                    onChange={onChangeGrindStepMemo}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3번 페이지 */}
          <div className="carousel-item flex flex-col h-full w-full">
            <div className="flex flex-col self-center gap-2">
              {/* <div className="form-control">
                <label className="label cursor-pointer gap-8">
                  <span className="label-text">린싱을 하지 않아요</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div> */}
              <div className="form-control">
                <label className="label cursor-pointer gap-8">
                  <span className="label-text">
                    블루밍 (뜸들이기)를 하지 않아요
                  </span>
                  <input
                    type="checkbox"
                    checked={isNoBloom}
                    onChange={() => setIsNoBloom(!isNoBloom)}
                    className="toggle toggle-primary"
                  />
                </label>
              </div>
              <div className="flex flex-row gap-2 items-center max-h-[20px] justify-center">
                <span className="label-text">총</span>
                <label className="flex items-center gap-2 label-text">
                  <input
                    type="number"
                    className="max-w-[40px] border-none focus:outline-none px-1 text-gray-900 text-center"
                    value={pourCount}
                    readOnly
                    onChange={onChangePourCount}
                  />
                  <span className="label-text">번 물을 부을거에요.</span>
                  <kbd
                    className="kbd kbd-sm cursor-pointer"
                    onClick={() => {
                      if (pourCount < 5) {
                        setPourCount(pourCount + 1);
                      } else {
                        alert("최대 5번까지만 가능합니다.");
                      }
                    }}
                  >
                    +
                  </kbd>
                  <kbd
                    className="kbd kbd-sm cursor-pointer"
                    onClick={() => {
                      if (pourCount > 1) {
                        setPourCount(pourCount - 1);
                      }
                    }}
                  >
                    -
                  </kbd>
                </label>
              </div>
            </div>

            <div className="py-4">
              <ul className="timeline timeline-vertical">
                {brewingInfo.map((info, index) => {
                  console.log(info);

                  return (
                    <InfoTimeline
                      key={index}
                      hasPrev={index > 0}
                      hasNext={index < brewingInfo.length - 1}
                      label={info.label}
                      order={info.order}
                      phase={info}
                      allInfo={brewingInfo}
                      setInfoAction={setBrewingInfo}
                    />
                  );
                })}
              </ul>
            </div>
          </div>

          {/* 4번 페이지 */}
          <div className="carousel-item flex flex-col h-full w-full bg-red-500">
            나는 4번 페이지 {currentPage === 4 && "(현재 페이지)"}
          </div>
        </div>
      </div>
    </div>
  );
}
