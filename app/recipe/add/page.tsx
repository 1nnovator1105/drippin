"use client";

import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import Select from "react-select";

const options = [
  { value: "harioV60", label: "하리오 V60" },
  { value: "chemex", label: "케멕스" },
  { value: "kalita", label: "칼리타" },
];

export default function RecipeAddPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [recipeName, setRecipeName] = useState("");

  const [isFade, setIsFade] = useState(false);

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

  useEffect(() => {
    if (recipeName) {
      setIsFade(true);
    } else {
      setIsFade(false);
    }
  }, [recipeName]);

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
          <div className="carousel-item flex flex-col h-full w-full">
            {/* 나는 1번 페이지 {currentPage === 1 && "(현재 페이지)"} */}
            <h1 className="text-2xl font-bold">1. 기본 정보 입력</h1>
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
                <Select options={options} />
                {/* <div className="label">
                <span className="label-text-alt">Bottom Left label</span>
                <span className="label-text-alt">Bottom Right label</span>
              </div> */}
              </label>
            )}
          </div>

          {/* 2번 페이지 */}
          <div className="carousel-item flex flex-col h-full w-full bg-red-500">
            나는 2번 페이지 {currentPage === 2 && "(현재 페이지)"}
          </div>

          {/* 3번 페이지 */}
          <div className="carousel-item flex flex-col h-full w-full bg-red-500">
            나는 3번 페이지 {currentPage === 3 && "(현재 페이지)"}
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
