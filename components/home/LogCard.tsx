export default function LogCard() {
  return (
    <div className="cursor-pointer">
      <div className="px-6 py-6 border-[1px] border-gray-300 rounded-lg">
        <img
          src="https://recipe1.ezmember.co.kr/cache/recipe/2021/12/17/b91c1c13f03f2c227646692f635e471b1.jpg"
          alt="recipe"
          className="w-full h-full"
        />
        <div className="flex flex-col mt-6">
          <div className="text-lg font-bold line-clamp-1">일지 제목</div>
          <div className="text-sm text-gray-500 mt-2 line-clamp-1">
            작성자 이름
          </div>

          <div className="text-sm text-gray-800 mt-6 line-clamp-3">
            #레시피_이름 #견과류 #코스타리카 #레시피_이름 #견과류 #코스타리카
            #레시피_이름 #견과류 #코스타리카
          </div>
        </div>
      </div>
    </div>
  );
}
