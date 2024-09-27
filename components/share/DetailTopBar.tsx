import { useRouter } from "next/navigation";
import BackIcon from "../icon/BackIcon";
import MoreIcon from "../icon/MoreIcon";

interface Props {
  showMoreOptions: boolean;
  deleteAction?: () => void;
}

export default function DetailTopBar({ showMoreOptions, deleteAction }: Props) {
  const router = useRouter();

  return (
    <div className="sticky top-0 flex flex-row gap-2 justify-between px-3 items-center text-xl font-bold z-[50] bg-white h-[52px] border-b-[1px] border-[#D9D9D9]">
      <div className="cursor-pointer" onClick={() => router.back()}>
        <BackIcon />
      </div>

      {showMoreOptions && (
        <details className="dropdown dropdown-end cursor-pointer">
          <summary className="border-none">
            <MoreIcon />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box min-w-[83px] z-[1] p-3 shadow top-[30px] rounded-lg">
            <li className="text-center" onClick={deleteAction}>
              삭제하기
            </li>
          </ul>
        </details>
      )}
    </div>
  );
}
