"use client";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

import CreatableSelector from "@/components/recipe/CreatableSelector";
import { SelectorOption, createOption } from "@/utils/selector";
import { Input } from "@/components/ui/input";
import InfoTimeline from "@/components/recipe/InfoTimeline";
import { BrewingInfo } from "@/types/brew";
import { PlusCircle } from "lucide-react";

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

  const [recipeDescription, setRecipeDescription] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [recipeDescription]);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setRecipeDescription(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-none justify-center items-center">
        {/* <ul className="steps">
          <li
            className={cn("step text-xs", currentPage >= 1 && "step-primary")}
          >
            기본정보
          </li>
          <li
            className={cn("step text-xs", currentPage >= 2 && "step-primary")}
          >
            물과 원두
          </li>
          <li
            className={cn("step text-xs", currentPage >= 3 && "step-primary")}
          >
            추출
          </li>
          <li
            className={cn("step text-xs", currentPage >= 4 && "step-primary")}
          >
            추가 정보
          </li>
        </ul> */}
        <div className="relative grid grid-cols-4 justify-center items-center mt-[10px]">
          <div className="absolute w-[202px] h-[1px] top-[35%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-transparent border-[1px] border-dashed border-black " />

          <div
            className={cn("w-[72px] flex justify-center items-center flex-col")}
          >
            <div
              className={cn(
                "w-[50px] h-[50px] rounded-full border-[1px] border-black bg-white flex justify-center items-center text-black z-[5]",
                currentPage === 1 && "bg-black text-white",
              )}
            >
              1
            </div>
            <div className="mt-1">기본 정보</div>
          </div>

          <div className="w-[72px] flex justify-center items-center flex-col">
            <div
              className={cn(
                "w-[50px] h-[50px] rounded-full border-[1px] border-black bg-white flex justify-center items-center text-black z-[5]",
                currentPage === 2 && "bg-black text-white",
              )}
            >
              2
            </div>
            <div className="mt-1">물과 원두</div>
          </div>

          <div className="w-[72px] flex justify-center items-center flex-col">
            <div
              className={cn(
                "w-[50px] h-[50px] rounded-full border-[1px] border-black bg-white flex justify-center items-center text-black z-[5]",
                currentPage === 3 && "bg-black text-white",
              )}
            >
              3
            </div>
            <div className="mt-1">추출</div>
          </div>

          <div className="w-[72px] flex justify-center items-center flex-col">
            <div
              className={cn(
                "w-[50px] h-[50px] rounded-full border-[1px] border-black bg-white flex justify-center items-center text-black z-[5]",
                currentPage === 4 && "bg-black text-white",
              )}
            >
              4
            </div>
            <div className="mt-1">추가 정보</div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 p-4">
        <div
          className="carousel carousel-vertical h-full w-full"
          onScroll={handleScroll}
        >
          {/* 1번 페이지 */}
          <div className="carousel-item flex flex-col h-full w-full gap-4">
            <div>
              <label className="form-control w-full max-w-xs">
                <div className="label flex flex-col items-start justify-start">
                  <p className="label-text">레시피 이름을 알려주세요.</p>
                  <p className="label-text text-xs text-gray-500">
                    여기서 레시피란 드립커피의 추출 방법을 말해요.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="레시피 이름"
                  className="input input-bordered w-full max-w-xs focus:outline-none"
                  value={recipeName}
                  onChange={onChangeRecipeName}
                />
              </label>
            </div>

            <div>
              <label className={"form-control w-full max-w-xs"}>
                <div className="label flex justify-between items-center">
                  <p className="label-text">어떤 드리퍼를 사용했나요?</p>
                </div>
                <CreatableSelector
                  value={dripper}
                  setValue={setDripper}
                  placeholder="드리퍼 종류"
                  defaultOptions={defaultDripperOptions}
                />
              </label>
            </div>

            <div>
              <label className={"form-control w-full max-w-xs"}>
                <div className="label flex justify-between items-center">
                  <p className="label-text">어떤 필터를 사용했나요?</p>
                </div>
                <CreatableSelector
                  value={filter}
                  setValue={setFilter}
                  placeholder="필터 종류"
                  defaultOptions={defaultFilterOptions}
                />
              </label>
            </div>

            <label className="max-w-xs">
              <div className="label flex justify-between items-center">
                <p className="label-text">어떤 온도에 잘 어울리나요?</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start flex gap-3">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={isIceRecipe}
                      onChange={() => setIsIceRecipe(!isIceRecipe)}
                    />
                    <span className="label-text">아이스 🧊</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start flex gap-3">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={isHotRecipe}
                      onChange={() => setIsHotRecipe(!isHotRecipe)}
                    />
                    <span className="label-text">핫 🔥</span>
                  </label>
                </div>
              </div>
            </label>
          </div>

          {/* 2번 페이지 */}
          <div className="carousel-item flex flex-col h-full w-full">
            <div>
              <div className="label">
                <p className="label-text">커피와 물의 비율을 알려주세요.</p>
              </div>
              <div className="flex w-full">
                <div>
                  <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
                    <Input
                      type="text"
                      placeholder="0"
                      className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={coffeeAmount ?? ""}
                      onChange={onChangeCoffeeAmount}
                    />
                  </div>
                  <div className="label-text text-center mt-1">
                    커피의 양(g)
                  </div>
                </div>

                <div className="justify-center items-center flex h-20 min-w-[40px] px-[11px]">
                  {showRatio &&
                    `1:${(Number(waterAmount) / Number(coffeeAmount)).toFixed(1).replace(/\.0$/, "")}`}
                </div>

                <div>
                  <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
                    <Input
                      type="text"
                      placeholder="0"
                      className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={waterAmount ?? ""}
                      onChange={onChangeWaterAmount}
                    />
                  </div>
                  <div className="label-text text-center mt-1">물의 양(g)</div>
                </div>

                <div>
                  <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
                    <Input
                      type="text"
                      placeholder="0"
                      className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={waterTemperature ?? ""}
                      onChange={onChangeWaterTemperature}
                    />
                  </div>
                  <div className="label-text text-center mt-1">
                    물의 온도(℃)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-[30px]">
              <div className="label">
                <p className="label-text">원두 분쇄도를 알려주세요.</p>
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

                <div className="mt-[30px]">
                  <label className="form-control w-full max-w-xs">
                    <div className="label flex flex-col items-start justify-start">
                      <p className="label-text">메모를 남겨주세요.</p>
                    </div>
                    <input
                      type="text"
                      placeholder="예) ek43 기준"
                      className="input input-bordered w-full max-w-xs focus:outline-none"
                      value={grindStepMemo}
                      onChange={onChangeGrindStepMemo}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 3번 페이지 */}
          <div className="carousel-item flex flex-col h-full w-full">
            <div className="flex flex-col w-full gap-2">
              <div className="form-control">
                <label className="label cursor-pointer gap-8">
                  <span className="label-text">
                    블루밍(뜸들이기)을 진행했나요?*
                  </span>
                </label>
              </div>
              <div className="join w-full">
                <input
                  className="join-item btn min-h-8 h-[32px] flex-1"
                  type="radio"
                  name="options"
                  aria-label="네"
                  defaultChecked
                  onChange={() => setIsNoBloom(false)}
                />
                <input
                  className="join-item btn min-h-8 h-[32px] flex-1"
                  type="radio"
                  name="options"
                  aria-label="아니오"
                  onChange={() => setIsNoBloom(true)}
                />
              </div>

              <div className="flex flex-row gap-2 items-center max-h-[20px] justify-center mt-[30px]">
                <span className="label-text">물을 몇 번 부었나요?</span>
                <label className="flex items-center gap-2 label-text">
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
                  <input
                    type="number"
                    className="max-w-[40px] border-none focus:outline-none px-1 text-gray-900 text-center"
                    value={pourCount}
                    readOnly
                    onChange={onChangePourCount}
                  />
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
                </label>
              </div>
            </div>

            <div className="pt-[30px]">
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
          <div className="carousel-item flex flex-col h-full w-full">
            <label className="form-control">
              <div className="label">
                <span className="label-text">
                  {`레시피에 대해 설명해주세요. (${recipeDescription.length}/500)`}
                </span>
              </div>
              <textarea
                ref={textareaRef}
                className="textarea textarea-bordered max-h-[200px] resize-none"
                placeholder="레시피 설명"
                value={recipeDescription}
                onChange={handleDescriptionChange}
                maxLength={500}
              ></textarea>
            </label>

            <label className="form-control mt-[30px]">
              <div className="label">
                <span className="label-text">사진을 첨부해주세요.</span>
              </div>
              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={handleFileUpload}
                  className="w-[70px] h-[70px] border-[1px] border-gray-300 rounded-md bg-white flex justify-center items-center"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <path
                      d="M41.25 24C41.25 24.1989 41.171 24.3897 41.0303 24.5303C40.8897 24.671 40.6989 24.75 40.5 24.75H24.75V40.5C24.75 40.6989 24.671 40.8897 24.5303 41.0303C24.3897 41.171 24.1989 41.25 24 41.25C23.8011 41.25 23.6103 41.171 23.4697 41.0303C23.329 40.8897 23.25 40.6989 23.25 40.5V24.75H7.5C7.30109 24.75 7.11032 24.671 6.96967 24.5303C6.82902 24.3897 6.75 24.1989 6.75 24C6.75 23.8011 6.82902 23.6103 6.96967 23.4697C7.11032 23.329 7.30109 23.25 7.5 23.25H23.25V7.5C23.25 7.30109 23.329 7.11032 23.4697 6.96967C23.6103 6.82902 23.8011 6.75 24 6.75C24.1989 6.75 24.3897 6.82902 24.5303 6.96967C24.671 7.11032 24.75 7.30109 24.75 7.5V23.25H40.5C40.6989 23.25 40.8897 23.329 41.0303 23.4697C41.171 23.6103 41.25 23.8011 41.25 24Z"
                      fill="#1E1E1E"
                    />
                  </svg>
                </button>
                {selectedImage && (
                  <div className="w-[70px] h-[70px] border-[1px] border-gray-300 rounded-md overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="선택된 이미지"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
