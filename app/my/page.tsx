"use client";

import { toast } from "sonner";

import useSupabaseBrowser from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginNudge from "@/components/auth/LoginNudge";
import Spinner from "@/components/share/Spinner";
import Header from "@/components/share/Header";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import useSession from "@/hooks/useSession";
import MyStats from "@/components/my/MyStats";

export default function MyPage() {
  const supabase = useSupabaseBrowser();

  const queryClient = useQueryClient();
  const router = useRouter();

  const [newHandle, setNewHandle] = useState<string | null>(null);

  const mySessionQuery = useSession();

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
      toast.success("닉네임이 변경되었어요");

      queryClient.invalidateQueries({ queryKey: ["drippin", "myProfile"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("닉네임 변경에 실패했어요. 다시 시도해주세요.");
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

  const preventClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open("https://walla.my/drippin-user", "_blank");
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
        {myProfileQuery.data?.user_name && (
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
        )}

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
              className="btn btn-sm btn-outline bg-brand text-brand-foreground"
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

        <MyStats />

        <div className="form-control w-full mt-4">
          <div className="label flex flex-col items-start justify-start">
            <p className="label-text text-base">설문조사</p>
          </div>
          <Link
            className="block"
            href="https://walla.my/drippin-user"
            target="_blank"
            onClick={preventClick}
          >
            <div className="flex items-center justify-between rounded-lg border border-border bg-brand-soft px-4 py-3">
              <div className="flex flex-col">
                <span className="font-semibold text-brand">
                  만족도 조사하고 커피 받아가세요 ☕
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  3분 설문 참여 시 추첨으로 블루보틀 기프티콘을 드려요
                </span>
              </div>
              <ChevronRight className="size-5 shrink-0 text-brand" />
            </div>
          </Link>
        </div>
      </div>

      <div className="flex justify-center items-center py-8">
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
