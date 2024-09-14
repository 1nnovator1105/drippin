"use client";

import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

import CreatableSelector from "@/components/recipe/CreatableSelector";
import { SelectorOption, createOption } from "@/utils/selector";
import { Input } from "@/components/ui/input";

export default function RecipeAddPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const [isFade, setIsFade] = useState(false);
  const [isDripperFade, setIsDripperFade] = useState(false);

  const [recipeName, setRecipeName] = useState("");
  const [dripper, setDripper] = useState<SelectorOption | null>(null);
  const [filter, setFilter] = useState<SelectorOption | null>(null);

  const [grindStep, setGrindStep] = useState<number>(50);
  const [grindStepMemo, setGrindStepMemo] = useState<string>("");

  const [coffeeAmount, setCoffeeAmount] = useState<string>("");
  const [waterAmount, setWaterAmount] = useState<string>("");
  const [waterTemperature, setWaterTemperature] = useState<string>("");

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

  useEffect(() => {
    if (recipeName) {
      setIsFade(true);
    } else {
      setIsFade(false);
    }
  }, [recipeName]);

  useEffect(() => {
    if (dripper) {
      setIsDripperFade(true);
    } else {
      setIsDripperFade(false);
    }
  }, [dripper]);

  const showRatio =
    waterAmount &&
    Number(waterAmount) > 0 &&
    coffeeAmount &&
    Number(coffeeAmount) > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-none justify-center items-center">
        <ul className="steps">
          <li className={cn("step", currentPage >= 1 && "step-primary")}>
            Register
          </li>
          <li className={cn("step", currentPage >= 2 && "step-primary")}>
            Choose plan
          </li>
          <li className={cn("step", currentPage >= 3 && "step-primary")}>
            Purchase
          </li>
          <li className={cn("step", currentPage >= 4 && "step-primary")}>
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

            {recipeName && (
              <label
                className={cn(
                  "form-control w-full max-w-xs",
                  isFade && "animate-fade",
                )}
              >
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
                {/* <div className="label">
                <span className="label-text-alt">Bottom Left label</span>
                <span className="label-text-alt">Bottom Right label</span>
              </div> */}
              </label>
            )}

            {dripper && (
              <label
                className={cn(
                  "form-control w-full max-w-xs",
                  isDripperFade && "animate-fade",
                )}
              >
                <div className="label flex justify-between items-center">
                  <p className="label-text">사용한 필터는 어떤건가요?</p>
                  {/* <p className="label-text-alt text-xs text-gray-500">
                  레시피는 드립커피 추출방법을 말해요.
                </p> */}
                </div>
                <CreatableSelector
                  value={filter}
                  setValue={setFilter}
                  defaultOptions={defaultFilterOptions}
                />
                {/* <div className="label">
                <span className="label-text-alt">Bottom Left label</span>
                <span className="label-text-alt">Bottom Right label</span>
              </div> */}
              </label>
            )}

            <div className="flex justify-start mt-4">
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
            </div>
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
            <div className="py-4">
              <ul className="timeline timeline-vertical">
                <li>
                  <div
                    className="timeline-start timeline-box"
                    onClick={() => {
                      const modal = document?.getElementById(
                        "my_modal_1",
                      ) as HTMLDialogElement;
                      modal?.showModal();
                    }}
                  >
                    블루밍 (뜸들이기)
                  </div>
                  <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                          ✕
                        </button>
                      </form>
                      <h3 className="font-bold text-lg">블루밍 (뜸들이기)</h3>
                      <p className="py-4">
                        Press ESC key or click on ✕ button to close
                      </p>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
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
                  <hr className="bg-primary" />
                </li>

                <li>
                  <hr className="bg-primary" />
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
                  <div className="timeline-end timeline-box">1차 추출</div>
                  <hr className="bg-primary" />
                </li>

                <li>
                  <hr className="bg-primary" />
                  <div className="timeline-start timeline-box">2차 추출</div>
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
                  <hr />
                </li>

                <li>
                  <hr />
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-end timeline-box">3차 추출</div>
                  <hr />
                </li>

                <li>
                  <hr />
                  <div className="timeline-start timeline-box">4차 추출</div>
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </li>
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
