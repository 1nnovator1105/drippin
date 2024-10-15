import { type RefObject, useEffect } from "react";

type Props = {
  /** 대상의 가시성을 확인하기 위한 뷰포트로 사용되는 요소 */
  root?: RefObject<HTMLElement>;
  /** 루트 요소 내에서 보이는지 확인할 대상 요소 */
  target: RefObject<HTMLElement>;
  /** 대상의 가시성 비율에서 관찰자의 콜백이 실행되어야 하는 단일 숫자 또는 숫자 배열 */
  threshold?: number;
  /** 루트 주변의 여백. CSS 마진 속성과 유사한 값을 가질 수 있음 (예: "10px 20px 30px 40px" - 상, 우, 하, 좌) */
  rootMargin?: string;
  /** Hook이 실행되어야 하는지 여부 */
  enabled?: boolean;
  /** 대상이 루트와 교차할 때 호출할 함수 */
  onIntersect: () => void;
};

/**
 * Intersection Observer API를 사용하는 Hook.
 * 이 Hook은 주어진 대상 요소를 관찰하고 지정된 루트와 교차할 때 콜백을 호출합니다.
 */
const useIntersectionObserver = ({
  root,
  target,
  threshold = 0.0,
  rootMargin = "20px",
  enabled = true,
  onIntersect,
}: Props) => {
  useEffect(() => {
    // Hook이 활성화 되어야 하는지 확인
    if (!enabled) return;

    // 새로운 Intersection Observer 초기화
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: root && root.current,
        rootMargin,
        threshold,
      },
    );

    // 대상 요소 가져오기
    const el = target && target.current;
    if (!el) return;

    // 대상 관찰 시작
    observer.observe(el);

    // 정리: 대상 관찰 중지
    return () => {
      observer.unobserve(el);
    };
  }, [root, target, onIntersect, threshold, rootMargin, enabled]); // 이 입력값이 변경되면 다시 실행
};

export default useIntersectionObserver;
