"use client";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import KakaoButton from "../auth/callback/kakao-button";
import AnimatedCoffeeIcon from "@/components/icon/AnimatedCoffeeIcon";
import { useEffect, useState } from "react";
import LoginNudge from "@/components/auth/LoginNudge";
import Spinner from "@/components/share/Spinner";
import Header from "@/components/share/Header";

export default function MyPage() {
  const supabase = useSupabaseBrowser();

  const queryClient = useQueryClient();
  const router = useRouter();

  const [newHandle, setNewHandle] = useState<string | null>(null);

  const mySessionQuery = useQuery({
    queryKey: ["drippin", "mySession"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data;
    },
  });

  const myProfileQuery = useQuery({
    queryKey: ["drippin", "myProfile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", mySessionQuery.data?.session?.user.id!)
        .throwOnError()
        .single();

      if (data?.handle) {
        setNewHandle(data.handle);
      }

      return data;
    },
    enabled: !!mySessionQuery.data?.session?.user.id,
  });

  const updateHandleMutation = useMutation({
    mutationFn: async (handle: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ handle: newHandle })
        .eq("id", mySessionQuery.data?.session?.user.id!)
        .throwOnError();

      if (error) {
        console.error(error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      alert("닉네임이 변경되었어요");

      queryClient.invalidateQueries({ queryKey: ["drippin"] });
    },
    onError: (error) => {
      console.error(error);
      alert("닉네임 변경에 실패했어요. 다시 시도해주세요.");
    },
  });

  const updateHandle = () => {
    if (newHandle) {
      updateHandleMutation.mutate(newHandle);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // all query invalidate
    queryClient.invalidateQueries();
  };

  const onChangeNewHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewHandle(e.target.value);
  };

  useEffect(() => {
    if (myProfileQuery.data?.handle) {
      setNewHandle(myProfileQuery.data.handle);
    }
  }, [myProfileQuery.data?.handle]);

  if (mySessionQuery.isLoading) return <Spinner />;

  if (!mySessionQuery.data?.session) return <LoginNudge />;

  return (
    <>
      <Header title="내정보" />
      <div className="px-4 py-2">
        <label className="form-control w-full">
          <div className="label flex flex-col items-start justify-start">
            <p className="label-text text-base">이름</p>
          </div>
          <input
            type="text"
            placeholder="이름"
            className="input input-bordered w-full focus:outline-none"
            value={myProfileQuery.data?.user_name || ""}
            disabled
            readOnly
          />
        </label>

        <label className="form-control w-full mt-4">
          <div className="label flex flex-col items-start justify-start">
            <p className="label-text text-base">이메일</p>
          </div>
          <input
            type="text"
            placeholder="이메일"
            className="input input-bordered w-full focus:outline-none"
            value={myProfileQuery.data?.email || ""}
            readOnly
            disabled
          />
        </label>

        <label className="form-control w-full mt-4">
          <div className="label flex flex-row items-start justify-between items-center">
            <p className="label-text text-base">닉네임</p>
            <button
              className="btn btn-sm btn-outline bg-black text-white"
              onClick={updateHandle}
            >
              변경하기
            </button>
          </div>
          <input
            type="text"
            placeholder="닉네임"
            className="input input-bordered w-full focus:outline-none"
            value={newHandle || ""}
            onChange={onChangeNewHandle}
          />
        </label>
      </div>
      <div className="fixed bottom-[88px] flex justify-center items-center w-full max-w-xl self-center">
        <button
          className="btn btn-sm btn-outline border-[#999999] p-2 text-[#999999]"
          onClick={handleSignOut}
        >
          로그아웃
        </button>
      </div>
    </>
  );
}
