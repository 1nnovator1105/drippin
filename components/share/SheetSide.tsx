"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { X } from "lucide-react";
import Link from "next/link";

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

type SheetSide = (typeof SHEET_SIDES)[number];

export function SheetSide({ side }: { side: SheetSide }) {
  const [isOpen, setIsOpen] = useState(true);

  const preventClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open("https://walla.my/drippin-user", "_blank");
  };

  useEffect(() => {
    const cookieValue = getCookie("notToday");
    if (cookieValue === "true") {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet key={side} open={isOpen}>
        <SheetContent
          side={side}
          onPointerDownOutside={() => {
            setIsOpen(false);
          }}
        >
          <SheetHeader>
            <SheetTitle>만족도 조사하고 커피 받아가세요 ☕</SheetTitle>
            <SheetDescription>
              3분 내외의 서비스 만족도 조사에 참여해주시면
              <br />
              추첨을 통해 블루보틀 기프티콘을 드려요!
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <div className="flex flex-col py-4">
              <Link
                className="w-full"
                href="https://walla.my/drippin-user"
                target="_blank"
                onClick={preventClick}
              >
                <Button className="w-full">참여하기</Button>
              </Link>
              <span
                className="text-xs text-gray-500 mt-2 text-center"
                onClick={() => {
                  setCookie("notToday", "true", {
                    maxAge: 60 * 60 * 24,
                  });
                  setIsOpen(false);
                }}
              >
                오늘 하루 보지 않기
              </span>
            </div>
          </SheetFooter>

          <SheetPrimitive.Close
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </SheetContent>
      </Sheet>
    </div>
  );
}
