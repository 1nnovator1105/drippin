"use client";

import { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";

type ModalState = Dispatch<SetStateAction<boolean>>;

interface ModalProps {
  readonly isOpen: boolean;
  readonly setOpen: ModalState;
}

const UI = ({ setOpen }: { setOpen: ModalState }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-1/2 h-1/2 bg-slate-300">
      <button
        className="border-2 border-indigo-500 border-solid rounded-md p-3.5 bg-indigo-500 hover:bg-white hover:text-orange-700"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-inherit">돌아가기</span>
      </button>
    </div>
  );
};

const TestModal = ({ isOpen, setOpen }: ModalProps) => {
  if (!isOpen) return null;
  return createPortal(
    <UI setOpen={setOpen} />,
    document.getElementById("modal-root") as HTMLDivElement,
  );
};

export default TestModal;
