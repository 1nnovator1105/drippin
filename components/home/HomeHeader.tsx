import { Coffee } from "lucide-react";

/**
 * 홈 상단 슬림 브랜드 헤더.
 * 처음 온 사용자가 서비스의 정체성과 가치를 바로 이해하도록
 * 워드마크 + 한 줄 태그라인을 노출한다. (탭 위, 비고정)
 */
export default function HomeHeader() {
  return (
    <div className="bg-brand-soft px-4 pt-4 pb-3">
      <div className="flex items-center gap-1.5">
        <Coffee className="size-5 text-brand" strokeWidth={2.5} />
        <span className="text-xl font-bold tracking-tight text-brand">
          Drippin
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        나만의 드립 레시피와 시음 일지를 기록하고 공유하세요
      </p>
    </div>
  );
}
