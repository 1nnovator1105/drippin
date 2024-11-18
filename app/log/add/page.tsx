"use client";

import { cn } from "@/utils/cn";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import CircleCloseIcon from "@/components/icon/CircleCloseIcon";
import { logEvent } from "@/utils/analytics";
import events from "@/utils/events";
import RecipeSelector from "@/components/share/RecipeSelector.tsx";

export default function LogAddPage() {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  const isMutating = useIsMutating();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const [logDescription, setLogDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [coffeeName, setCoffeeName] = useState("");
  const [coffeePlace, setCoffeePlace] = useState("");
  const [coffeeTags, setCoffeeTags] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  const mySessionQuery = useQuery({
    queryKey: ["drippin", "mySession"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    },
  });

  const createLogMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("logs")
        .insert({
          user_id: mySessionQuery.data?.session?.user?.id!,
          content: logDescription,
          image_url: imageUrl,
          coffee_name: coffeeName,
          coffee_place: coffeePlace,
          tags: coffeeTags,
          recipe_id: selectedRecipe?.value,
        })
        .throwOnError();

      return data;
    },
    onSuccess: () => {
      logEvent(events.submitAddLog);

      alert("일지가 게시되었어요!");
      queryClient.invalidateQueries({ queryKey: ["drippin"] });
      router.push("/log");
    },
    onError: (error) => {
      alert(
        "일지가 게시되지 않았어요. 잠시 후 시도해주세요. 반복될 경우, 관리자에게 문의해주세요.",
      );
    },
  });

  const resetImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setImageFile(null);
    setImageUrl(null);
    setSelectedImage(null);
  };

  const handleSubmit = () => {
    if (coffeeName === "" || coffeePlace === "" || coffeeTags === "") {
      alert("커피 이름, 장소, 태그를 입력해주세요.");
      return;
    }

    if (logDescription === "") {
      alert("일지 내용을 입력해주세요.");
      return;
    }

    createLogMutation.mutate();
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setLogDescription(e.target.value);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
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

        const bucket = "images/logs"; // 버킷 이름으로 변경
        const fileName = `${Date.now().toString()}.${compressedFile.type.split("/")[1]}`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, compressedFile);

        if (error) {
          alert("이미지가 업로드되지 않았어요. 잠시 후 시도해주세요.");
          return;
        }

        const publicUrl = supabase.storage.from(bucket).getPublicUrl(fileName);

        setImageUrl(publicUrl.data.publicUrl);
      }
    } catch (error) {
      alert("이미지가 업로드되지 않았어요. 잠시 후 시도해주세요.");
    }
  };

  const handleCoffeeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoffeeName(e.target.value);
  };

  const handleCoffeePlace = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoffeePlace(e.target.value);
  };

  const handleCoffeeTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoffeeTags(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [logDescription]);

  useEffect(() => {
    // 세션이 없으면 이전 페이지로 이동
    if (mySessionQuery.isSuccess && !mySessionQuery.data?.session?.user) {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    }
  }, [mySessionQuery.data?.session?.user]);

  return (
    <div
      className={cn(
        "flex flex-col h-full overflow-y-hidden overflow-x-hidden",
        isMutating && "opacity-50",
      )}
    >
      <div className="flex flex-1 p-3">
        <div className="carousel w-full">
          {currentPage === 1 && (
            <div className="carousel-item flex flex-col w-full">
              <label className="form-control">
                <div className="label">
                  <span className="label-text text-base">
                    일지를 작성해주세요
                    <span className="text-red-500 px-1">*</span>
                  </span>
                </div>
                <textarea
                  ref={textareaRef}
                  className="textarea textarea-bordered min-h-[300px] max-h-[300px] resize-none focus:outline-none focus:ring-0 focus:ring-offset-0"
                  placeholder="일지 내용"
                  value={logDescription}
                  onChange={handleDescriptionChange}
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
                  className="btn w-full bg-[#2C2C2C] text-[#F5F5F5]"
                  onClick={() => setCurrentPage(2)}
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {currentPage === 2 && (
            <div className="carousel-item flex flex-col w-full">
              <label className="form-control w-full">
                <div className="label flex flex-col items-start justify-start">
                  <p className="label-text text-base">
                    어떤 커피를 마셨나요?
                    <span className="text-red-500 px-1">*</span>
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="커피 이름"
                  className="input input-bordered w-full focus:outline-none"
                  value={coffeeName}
                  onChange={handleCoffeeName}
                />
              </label>

              <label className="form-control w-full mt-4">
                <div className="label flex flex-col items-start justify-start">
                  <p className="label-text text-base">
                    어디서 마셨나요?
                    <span className="text-red-500 px-1">*</span>
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="장소 이름"
                  className="input input-bordered w-full focus:outline-none"
                  value={coffeePlace}
                  onChange={handleCoffeePlace}
                />
              </label>

              <label className="form-control w-full mt-4">
                <div className="label flex flex-row items-start justify-between items-center">
                  <p className="label-text text-base">
                    태그를 입력해주세요.
                    <span className="text-red-500 px-1">*</span>
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="#태그 #띄어쓰기로구분돼요"
                  className="input input-bordered w-full focus:outline-none"
                  value={coffeeTags}
                  onChange={handleCoffeeTags}
                />
              </label>

              <div className="mt-4">
                <label className={"form-control w-full"}>
                  <div className="label flex justify-between items-center">
                    <p className="label-text text-base">
                      어떤 레시피를 사용했나요?
                    </p>
                  </div>
                  <RecipeSelector
                    value={selectedRecipe}
                    setValue={setSelectedRecipe}
                  />
                </label>
              </div>

              <div className="fixed bottom-[88px] flex justify-between items-center w-full max-w-xl self-center gap-3 px-4">
                <button
                  className="btn bg-[#FFFFFF] text-[#1E1E1E] border-[#2C2C2C] flex-1"
                  onClick={() => setCurrentPage(1)}
                >
                  이전
                </button>

                <button
                  className="btn bg-[#2C2C2C] text-[#F5F5F5] flex-1"
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
