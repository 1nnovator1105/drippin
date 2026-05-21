"use client";

import { toast } from "sonner";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

import CreatableSelector from "@/components/share/CreatableSelector";
import { SelectorOption, createOption } from "@/utils/selector";
import { Input } from "@/components/ui/input";
import InfoTimeline from "@/components/recipe/InfoTimeline";
import { BrewingInfo } from "@/types/brew";
import imageCompression from "browser-image-compression";

import useSupabaseBrowser from "@/utils/supabase/client";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import CircleCloseIcon from "@/components/icon/CircleCloseIcon";
import { logEvent } from "@/utils/analytics";
import events from "@/utils/events";
import { queryKeys } from "@/queries/queryKeys";
import { fetchRecipeDetail } from "@/queries/recipe";
import Spinner from "@/components/share/Spinner";
import useSession from "@/hooks/useSession";
import { invalidateRecipeQueries } from "@/utils/invalidate";

export default function EditRecipe({ recipeId }: { recipeId: string }) {
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const queryClient = useQueryClient();

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const isMutating = useIsMutating();

  const mySessionQuery = useSession();

  const recipeQuery = useQuery({
    queryKey: queryKeys.recipeDetail(recipeId),
    queryFn: () => fetchRecipeDetail(supabase, recipeId),
  });

  useEffect(() => {
    if (recipeQuery.data) {
      setRecipeName(recipeQuery.data.recipe_name);

      if (recipeQuery?.data?.use_dripper) {
        const findDripper = defaultDripperOptions.find(
          (option) => option.value === recipeQuery?.data?.use_dripper,
        );
        if (findDripper) {
          setDripper(findDripper);
        } else {
          setDripper(createOption(recipeQuery?.data?.use_dripper));
        }
      }
      if (recipeQuery?.data?.use_filter) {
        const findFilter = defaultFilterOptions.find(
          (option) => option.value === recipeQuery?.data?.use_filter,
        );
        if (findFilter) {
          setFilter(findFilter);
        } else {
          setFilter(createOption(recipeQuery?.data?.use_filter));
        }
      }

      if (recipeQuery.data.is_ice) {
        setIsIceRecipe(recipeQuery.data.is_ice);
      }

      if (recipeQuery.data.is_hot) {
        setIsHotRecipe(recipeQuery.data.is_hot);
      }

      setCoffeeAmount(recipeQuery.data.coffee_amount.toString());

      setWaterAmount(recipeQuery.data.water_amount.toString());

      setWaterTemperature(recipeQuery.data.water_temperature.toString());

      setGrindStep(recipeQuery.data.grind_step);

      if (recipeQuery.data.grind_step_memo) {
        setGrindStepMemo(recipeQuery.data.grind_step_memo);
      }

      setIsNoBloom(recipeQuery.data.is_no_bloom);

      setPourCount(recipeQuery.data.pour_count);

      if (recipeQuery.data.recipe_description) {
        setRecipeDescription(recipeQuery.data.recipe_description);
      }

      if (recipeQuery.data.image_url) {
        setImageUrl(recipeQuery.data.image_url);

        setSelectedImage(recipeQuery.data.image_url);
      }

      if (recipeQuery.data.raw_brewing_info) {
        setTimeout(() => {
          setBrewingInfo(
            JSON.parse(JSON.stringify(recipeQuery?.data?.raw_brewing_info)),
          );
        }, 16);
      }
    }
    // 매 렌더 새로 생성되는 default 옵션 배열을 의존성에 넣으면 루프 → 의도적 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeQuery.data]);

  const recipeEditMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .update({
          recipe_name: recipeName || "",
          use_dripper: dripper?.value || "",
          use_filter: filter?.value || "",
          is_ice: isIceRecipe,
          is_hot: isHotRecipe,
          coffee_amount: Number(coffeeAmount) || -1,
          water_amount: Number(waterAmount) || -1,
          water_temperature: Number(waterTemperature) || -1,
          grind_step: grindStep || -1,
          grind_step_memo: grindStepMemo || "",
          is_no_bloom: isNoBloom,
          pour_count: pourCount || -1,
          raw_brewing_info: JSON.parse(JSON.stringify(brewingInfo)),
          recipe_description: recipeDescription || "",
          image_url: imageUrl || "",
        })
        .eq("id", recipeId)
        .throwOnError();

      return data;
    },
    onSuccess: () => {
      logEvent(events.submitEditRecipe);

      toast.success("레시피가 수정되었어요!");
      router.push("/recipe");
      invalidateRecipeQueries(queryClient);
    },
    onError: (error) => {
      toast.error(
        "레시피가 게시되지 않았어요. 잠시 후 시도해주세요. 반복될 경우, 관리자에게 문의해주세요.",
      );
    },
  });

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const resetImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setImageFile(null);
    setImageUrl(null);
    setSelectedImage(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const options = {
      maxSizeMB: 1.5, // 이미지 최대 용량
      maxWidthOrHeight: 1280, // 최대 넓이(혹은 높이)
      useWebWorker: true,
    };

    try {
      if (file) {
        const compressedFile = await imageCompression(file, options);
        setImageFile(compressedFile);
        const promise = imageCompression.getDataUrlFromFile(compressedFile);
        promise.then((result) => {
          setSelectedImage(result);
        });

        const bucket = "images/recipes"; // 버킷 이름으로 변경
        const fileName = `${Date.now().toString()}.${compressedFile.type.split("/")[1]}`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, compressedFile);

        if (error) {
          toast.error("이미지가 업로드되지 않았어요. 잠시 후 시도해주세요.");
          return;
        }

        const publicUrl = supabase.storage.from(bucket).getPublicUrl(fileName);

        setImageUrl(publicUrl.data.publicUrl);
      }
    } catch (error) {
      toast.error("이미지가 업로드되지 않았어요. 잠시 후 시도해주세요.");
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const scrollPosition = container.scrollLeft;
    const pageWidth = container.clientWidth;

    const newPage = Math.ceil(scrollPosition / pageWidth) + 1;
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

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setRecipeDescription(e.target.value);
  };

  const validateForSubmit = () => {
    if (!recipeName) {
      toast.error("레시피 이름을 입력해주세요.");
      return false;
    }

    if (!coffeeAmount) {
      toast.error("커피의 양을 입력해주세요.");
      return false;
    }

    if (!waterAmount) {
      toast.error("물의 양을 입력해주세요.");
      return false;
    }

    if (!waterTemperature) {
      toast.error("물의 온도를 입력해주세요.");
      return false;
    }

    if (!isIceRecipe && !isHotRecipe) {
      toast.error("아이스와 핫 중 하나는 선택해주세요.");
      return false;
    }

    const copyBrewInfoWithoutLast = brewingInfo.slice(0, -1);
    const noTimeBrewInfo = copyBrewInfoWithoutLast.filter(
      (info) => info.time === null,
    );

    if (noTimeBrewInfo.length > 0) {
      toast.error("모든 시간을 입력해주세요.");
      return false;
    }
    if (!recipeDescription) {
      toast.error("레시피 설명을 입력해주세요.");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForSubmit()) {
      return;
    }

    recipeEditMutation.mutate();
  };

  useEffect(() => {
    // currentPage가 변경될때 마다 스크롤 이동
    const container = document.querySelector(".carousel");
    if (container) {
      container.scrollTo({
        left: (currentPage - 1) * container.clientWidth,
        behavior: "instant",
      });
      if (window) {
        window.scrollTo(0, 0);
      }
    }
  }, [currentPage]);

  useEffect(() => {
    makebrewingInfo(isNoBloom, pourCount);
  }, [isNoBloom, pourCount]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [recipeDescription]);

  useEffect(() => {
    // 세션이 없으면 이전 페이지로 이동
    if (mySessionQuery.isSuccess && !mySessionQuery.data?.session?.user) {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    }
    // 세션 사용자 변화에만 반응하는 리다이렉트 가드 → 나머지 의존성 의도적 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySessionQuery.data?.session?.user]);

  if (recipeQuery.isLoading) return <Spinner />;

  if (recipeQuery.data?.user_id !== mySessionQuery.data?.session?.user?.id) {
    return <div>You are not the owner of this recipe</div>;
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full overflow-y-hidden overflow-x-hidden",
        isMutating && "opacity-50",
      )}
    >
      <div className="flex flex-none justify-center items-center">
        <div className="relative grid grid-cols-4 justify-center items-center mt-[10px]">
          <div className="absolute w-[202px] h-[1px] top-[31%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-transparent border-[1px] border-dashed border-black " />

          <div
            className={cn("w-[72px] flex justify-center items-center flex-col")}
          >
            <div
              className={cn(
                "w-[40px] h-[40px] rounded-full border-[1px] border-black bg-white flex justify-center items-center text-black z-[5] font-bold text-lg",
                currentPage === 1 && "bg-brand text-brand-foreground",
              )}
              onClick={() => setCurrentPage(1)}
            >
              1
            </div>
            <div className="mt-1 text-xs text-[#000]">기본 정보</div>
          </div>

          <div className="w-[72px] flex justify-center items-center flex-col">
            <div
              className={cn(
                "w-[40px] h-[40px] rounded-full border-[1px] border-black bg-white flex justify-center items-center text-black z-[5]  font-bold text-lg",
                currentPage === 2 && "bg-brand text-brand-foreground",
              )}
              onClick={() => setCurrentPage(2)}
            >
              2
            </div>
            <div className="mt-1 text-xs text-[#000]">물과 원두</div>
          </div>

          <div className="w-[72px] flex justify-center items-center flex-col">
            <div
              className={cn(
                "w-[40px] h-[40px] rounded-full border-[1px] border-black bg-white flex justify-center items-center text-black z-[5] font-bold text-lg",
                currentPage === 3 && "bg-brand text-brand-foreground",
              )}
              onClick={() => setCurrentPage(3)}
            >
              3
            </div>
            <div className="mt-1 text-xs text-[#000]">추출</div>
          </div>

          <div className="w-[72px] flex justify-center items-center flex-col">
            <div
              className={cn(
                "w-[40px] h-[40px] rounded-full border-[1px] border-black bg-white flex justify-center items-center text-black z-[5] font-bold text-lg",
                currentPage === 4 && "bg-brand text-brand-foreground",
              )}
              onClick={() => setCurrentPage(4)}
            >
              4
            </div>
            <div className="mt-1 text-xs text-[#000]">추가 정보</div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 p-3">
        <div className="carousel w-full pb-[88px]" onScroll={handleScroll}>
          {/* 1번 페이지 */}
          {currentPage === 1 && (
            <div className="carousel-item flex flex-col w-full gap-4">
              <div>
                <label className="form-control w-full">
                  <div className="label flex flex-col items-start justify-start">
                    <p className="label-text text-base">
                      레시피 이름을 알려주세요.
                      <span className="text-red-500 px-1">*</span>
                    </p>
                    <p className="label-text text-xs text-gray-500">
                      여기서 레시피란 드립커피의 추출 방법을 말해요.
                    </p>
                  </div>
                  <input
                    type="text"
                    placeholder="레시피 이름"
                    className="input input-bordered w-full focus:outline-none"
                    value={recipeName}
                    onChange={onChangeRecipeName}
                  />
                </label>
              </div>

              <div>
                <label className={"form-control w-full"}>
                  <div className="label flex justify-between items-center">
                    <p className="label-text text-base">
                      어떤 드리퍼를 사용했나요?
                    </p>
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
                <label className={"form-control w-full"}>
                  <div className="label flex justify-between items-center">
                    <p className="label-text text-base">
                      어떤 필터를 사용했나요?
                    </p>
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
                  <p className="label-text text-base">
                    어떤 온도에 잘 어울리나요?
                    <span className="text-red-500 px-1">*</span>
                  </p>
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
                      <span className="label-text text-base">아이스 🧊</span>
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
                      <span className="label-text text-base">핫 🔥</span>
                    </label>
                  </div>
                </div>
              </label>

              <div className="fixed bottom-[88px] flex justify-between items-center w-full max-w-xl self-center gap-3 px-4">
                <button
                  className="btn btn-md bg-brand text-brand-foreground flex-1"
                  onClick={() => setCurrentPage(2)}
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* 2번 페이지 */}
          {currentPage === 2 && (
            <div className="carousel-item flex flex-col w-full">
              <div>
                <div className="label">
                  <p className="label-text text-base">
                    커피와 물의 비율을 알려주세요.
                    <span className="text-red-500 px-1">*</span>
                  </p>
                </div>
                <div className="flex w-full">
                  <div>
                    <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={coffeeAmount ?? ""}
                        onChange={onChangeCoffeeAmount}
                      />
                    </div>
                    <div className="label-text text-center mt-1 text-xs">
                      커피의 양(g)
                    </div>
                  </div>

                  <div className="justify-center items-center flex h-20 min-w-[40px] px-[11px] text-lg font-bold">
                    {showRatio &&
                      `1:${(Number(waterAmount) / Number(coffeeAmount)).toFixed(1).replace(/\.0$/, "")}`}
                  </div>

                  <div>
                    <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center text-base">
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                        value={waterAmount ?? ""}
                        onChange={onChangeWaterAmount}
                      />
                    </div>
                    <div className="label-text text-center mt-1 text-xs">
                      물의 양(g)
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-[30px]">
                <div className="label">
                  <p className="label-text text-base">
                    물의 온도를 알려주세요.
                    <span className="text-red-500 px-1">*</span>
                  </p>
                </div>
                <div className="card bg-base-300 rounded-box grid h-20 place-items-center text-base">
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-base-300 text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                    value={waterTemperature ?? ""}
                    onChange={onChangeWaterTemperature}
                  />
                </div>
                <div className="label-text text-center mt-1 text-xs">℃</div>
              </div>

              <div className="mt-[30px]">
                <div className="label">
                  <p className="label-text text-base">
                    원두 분쇄도를 알려주세요.
                    <span className="text-red-500 px-1">*</span>
                  </p>
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
                    <span className="text-left">
                      곱게
                      <br />
                      <span className="text-[9px]">(~400μm)</span>
                    </span>
                    <span className="text-center">
                      약간 곱게
                      <br />
                      <span className="text-[9px]">(~600μm)</span>
                    </span>
                    <span className="text-center">
                      보통
                      <br />
                      <span className="text-[9px]">(~800μm)</span>
                    </span>
                    <span className="text-center">
                      약간 굵게
                      <br />
                      <span className="text-[9px]">(~1000μm)</span>
                    </span>
                    <span className="text-right">
                      굵게
                      <br />
                      <span className="text-[9px]">(~1400μm)</span>
                    </span>
                  </div>

                  <div className="mt-[30px]">
                    <label className="form-control w-full">
                      <div className="label flex flex-col items-start justify-start">
                        <p className="label-text text-base">
                          메모를 남겨주세요.
                        </p>
                      </div>
                      <input
                        type="text"
                        placeholder="예) ek43 기준"
                        className="input input-bordered w-full focus:outline-none text-base"
                        value={grindStepMemo}
                        onChange={onChangeGrindStepMemo}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="fixed bottom-[88px] flex justify-between items-center w-full max-w-xl self-center gap-3 px-4">
                <button
                  className="btn btn-md bg-[#FFFFFF] text-foreground border-[#2C2C2C] flex-1"
                  onClick={() => setCurrentPage(1)}
                >
                  이전
                </button>

                <button
                  className="btn btn-md bg-brand text-brand-foreground flex-1"
                  onClick={() => setCurrentPage(3)}
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* 3번 페이지 */}
          {currentPage === 3 && (
            <div className="carousel-item flex flex-col w-full">
              <div className="flex flex-col w-full gap-2">
                <div className="form-control">
                  <div className="label flex flex-col items-start gap-0.5">
                    <span className="label-text text-base">
                      블루밍(뜸들이기)을 진행했나요?
                      <span className="text-red-500 px-1">*</span>
                    </span>
                    <span className="label-text text-xs text-gray-500">
                      블루밍은 추출 전 소량의 물로 원두를 적셔 가스를 빼는
                      과정이에요.
                    </span>
                  </div>
                </div>
                <div className="join w-full">
                  <input
                    className="join-item btn min-h-8 h-8 flex-1"
                    type="radio"
                    name="options"
                    style={{
                      background: isNoBloom ? "white" : "white",
                      borderColor: isNoBloom ? "#B3B3B3" : "black",
                      color: isNoBloom ? "#B3B3B3" : "black",
                    }}
                    aria-label="네"
                    defaultChecked
                    onChange={() => setIsNoBloom(false)}
                  />
                  <input
                    className="join-item btn min-h-8 h-8 flex-1"
                    type="radio"
                    name="options"
                    style={{
                      background: isNoBloom ? "white" : "white",
                      borderColor: isNoBloom ? "black" : "#B3B3B3",
                      color: isNoBloom ? "black" : "#B3B3B3",
                    }}
                    aria-label="아니오"
                    onChange={() => setIsNoBloom(true)}
                  />
                </div>

                <div className="flex flex-row gap-2 items-center max-h-[20px] justify-center mt-[30px]">
                  <span className="label-text text-base">
                    물을 몇 번 부었나요?
                    <span className="text-red-500 px-1">*</span>
                  </span>
                  <label className="flex items-center gap-2 label-text">
                    <div
                      onClick={() => {
                        if (pourCount > 1) {
                          setPourCount(pourCount - 1);
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                      >
                        <path
                          d="M12 18H24M7.5 4.5H28.5C30.1569 4.5 31.5 5.84315 31.5 7.5V28.5C31.5 30.1569 30.1569 31.5 28.5 31.5H7.5C5.84315 31.5 4.5 30.1569 4.5 28.5V7.5C4.5 5.84315 5.84315 4.5 7.5 4.5Z"
                          stroke="#1E1E1E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="border-b-[1px] border-[#1E1E1E]">
                      <input
                        type="number"
                        className="max-w-[40px] focus:outline-none text-gray-900 text-center py-2"
                        value={pourCount}
                        readOnly
                        onChange={onChangePourCount}
                      />
                    </div>
                    <div
                      onClick={() => {
                        if (pourCount < 5) {
                          setPourCount(pourCount + 1);
                        } else {
                          toast.error("물붓기는 최대 5번까지 가능해요.");
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                      >
                        <path
                          d="M18 12V24M12 18H24M7.5 4.5H28.5C30.1569 4.5 31.5 5.84315 31.5 7.5V28.5C31.5 30.1569 30.1569 31.5 28.5 31.5H7.5C5.84315 31.5 4.5 30.1569 4.5 28.5V7.5C4.5 5.84315 5.84315 4.5 7.5 4.5Z"
                          stroke="#1E1E1E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-[30px]">
                <ul className="timeline timeline-vertical">
                  {brewingInfo.map((info, index) => {
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
                        setCurrentPageAction={setCurrentPage}
                      />
                    );
                  })}
                </ul>
              </div>

              <div className="fixed bottom-[88px] flex justify-between items-center w-full max-w-xl self-center gap-3 px-4">
                <button
                  className="btn btn-md bg-[#FFFFFF] text-foreground border-[#2C2C2C] flex-1"
                  onClick={() => setCurrentPage(2)}
                >
                  이전
                </button>

                <button
                  className="btn btn-md bg-brand text-brand-foreground flex-1"
                  onClick={() => setCurrentPage(4)}
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* 4번 페이지 */}
          {currentPage === 4 && (
            <div className="carousel-item flex flex-col w-full">
              <label className="form-control">
                <div className="label">
                  <span className="label-text text-base">
                    {`레시피에 대해 설명해주세요. (${recipeDescription.length}/500)`}
                    <span className="text-red-500 px-1">*</span>
                  </span>
                </div>
                <textarea
                  ref={textareaRef}
                  className="textarea textarea-bordered min-h-[220px] max-h-[220px] resize-none focus:outline-none focus:ring-0 focus:ring-offset-0"
                  placeholder="레시피 설명"
                  value={recipeDescription}
                  onChange={handleDescriptionChange}
                  maxLength={500}
                ></textarea>
              </label>

              <label className="form-control mt-[30px]">
                <div className="label">
                  <span className="label-text text-base">
                    사진을 첨부해주세요.
                  </span>
                </div>
                <div className="flex items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {selectedImage ? (
                    <button
                      className="relative w-[70px] h-[70px] border-[1px] border-gray-300 rounded-md overflow-hidden"
                      onClick={resetImage}
                    >
                      {/* 로컬 이미지 미리보기(70px)라 next/image 불필요 */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedImage}
                        alt="선택된 이미지"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-5 right-4">
                        <CircleCloseIcon />
                      </div>
                    </button>
                  ) : (
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
                  )}
                </div>
              </label>

              <div className="fixed bottom-[88px] flex justify-between items-center w-full max-w-xl self-center gap-3 px-4">
                <button
                  className="btn btn-md bg-[#FFFFFF] text-foreground border-[#2C2C2C] flex-1"
                  onClick={() => setCurrentPage(3)}
                >
                  이전
                </button>

                <button
                  className="btn btn-md bg-brand text-brand-foreground flex-1"
                  onClick={handleSubmit}
                >
                  게시하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
