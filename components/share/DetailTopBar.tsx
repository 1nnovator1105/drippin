import { useRouter } from "next/navigation";
import BackIcon from "../icon/BackIcon";
import MoreIcon from "../icon/MoreIcon";

interface Props {
  showMoreOptions: boolean;
  deleteAction?: () => void;
  editAction?: () => void;
}

export default function DetailTopBar({
  showMoreOptions,
  deleteAction,
  editAction,
}: Props) {
  const router = useRouter();

  return (
    <div className="sticky top-0 flex flex-row gap-2 justify-between px-3 items-center text-xl font-bold z-[50] bg-white h-[52px] border-b-[1px] border-[#D9D9D9]">
      <div
        className="cursor-pointer"
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
          }
        }}
      >
        <BackIcon />
      </div>

      {showMoreOptions && (
        <details className="dropdown dropdown-end cursor-pointer">
          <summary className="border-none">
            <MoreIcon />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box w-[83px] z-[1] px-0 py-0 shadow top-[30px] rounded-lg">
            <li
              className="text-center text-base py-3 border-b-[1px] border-[#D9D9D9]"
              onClick={editAction}
            >
              수정하기
            </li>
            <li className="text-center text-base py-3" onClick={deleteAction}>
              삭제하기
            </li>
          </ul>
        </details>
      )}
    </div>
  );
}
