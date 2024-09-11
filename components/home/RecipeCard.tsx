export default function RecipeCard() {
  return (
    <div className="cursor-pointer">
      <div className="px-6 py-6 border-[1px] border-gray-300 rounded-lg">
        <img
          src="https://i.namu.wiki/i/OAgRFaWgKvdd-7VIvE3I9S-xfuaD-ou2CDvFkQP49lnBVquyEEGxuBeocq5NHdTctktVuuCSlKnAKjUQlsu1oaXQWfPOjYLvDnnNXFPpP5y2HGiizTKvW92LoBYz-m3Qd1Fx0R1wEGV_kbJz8DxIzA.webp"
          alt="recipe"
          className="w-full h-full"
        />
        <div className="flex flex-col mt-6">
          <div className="text-lg font-bold line-clamp-1">레시피 이름</div>
          <div className="text-sm text-gray-500 mt-2 line-clamp-1">
            작성자 이름
          </div>

          <div className="text-sm text-gray-800 mt-6 line-clamp-3">
            이 레시피는 영국에서 최초로 시작되어 일년에 한바퀴를 돌면서 받는
            사람에게 행운을 주었고 지금은 당신에게로 옮겨진 이 편지는 당신의
            손에 손을 잡고 너무나 행복한 시간을 보내길 바랍니다. 그리고 당신의
            손에 손을 잡고 너무나 행복한 시간을 보내길 바랍니다. 또한 당신의
            손에 손을 잡고 너무나 행복한 시간을 보내길 바랍니다. 뭐여 이건
            뭐라고 써야할까 이건 뭐라고 써야할까 이건 뭐라고 어허
          </div>
        </div>
      </div>
    </div>
  );
}
