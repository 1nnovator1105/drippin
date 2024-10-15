import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import React, { useRef } from "react";

type Props = {
  fetchNextPage: any;
  hasNextPage?: boolean;
  isError: boolean;
};

const FetchMore: React.FC<Props> = ({
  fetchNextPage,
  hasNextPage,
  isError,
}) => {
  const loadMoreButtonRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  return (
    !isError && (
      <div ref={loadMoreButtonRef}>
        {hasNextPage && <div className="h-10 w-full" />}
      </div>
    )
  );
};

export default FetchMore;
