import Image from "next/image";
import LikeIcon from "../icon/LikeIcon";
import TagChip from "../share/TagChip";

export default function RecipeCard() {
  return (
    <div className="cursor-pointer w-full">
      <div className="flex flex-col gap-3">
        <div className="relative w-full h-[170px]">
          <Image
            src="https://cdn.sisajournal.com/news/photo/201912/193472_98491_3733.jpg"
            alt="recipe"
            className="w-full h-full object-cover"
            fill
          />
        </div>

        <div className="flex items-center gap-[6px]">
          <LikeIcon fill="#1E1E1E" stroke="#1E1E1E" strokeWidth="2.5" />
          <span>99명의 드리핀이 좋아해요</span>
        </div>

        <div className="flex font-bold">센터푸어 레시피</div>

        <div className="flex items-center gap-2">
          <TagChip label="1분 30초" className="text-black bg-[#CCC]" />
          <TagChip label="ICE" className="text-white bg-[#699BF7]" />
          <TagChip label="HOT" className="text-white bg-[#F24E1E]" />
        </div>

        <div className="line-clamp-3 text-gray-900">
          <span className="text-gray-500">@센터커피</span> 이 레시피는 영국에서
          최초로 시작되어 일년에 한바퀴를 돌면서 받는 사람에게 행운을 주었고
          지금은 당신에게로 옮겨진 이 편지는 이 레시피는 영국에서 최초로
          시작되어 일년에 한바퀴를 돌면서 받는 어쩌구 저쩌구이다 그렇다그렇다
          한바퀴를 돌면서 받는 사람에게 행운을 주었고 지금은 당신에게로 옮겨진
          이 편지는 이 레시피는 영국에서 최초로 시작되어 일년에 한바퀴를 돌면서
          받는 어쩌구 저쩌구이다 그렇다그렇다 한바퀴를 돌면서 받는 사람에게
          행운을 주었고 지금은 당신에게로 옮겨진 이 편지는 이 레시피는 영국에서
          최초로 시작되어 일년에 한바퀴를 돌면서 받는 어쩌구 저쩌구이다
          그렇다그렇다
        </div>
      </div>
    </div>
  );
}
