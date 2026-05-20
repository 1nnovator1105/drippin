import { useEffect, useState } from "react";

/**
 * 입력값을 지정한 지연(ms) 후에만 갱신해, 검색 등에서 과도한 호출을 막는다.
 */
export default function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
