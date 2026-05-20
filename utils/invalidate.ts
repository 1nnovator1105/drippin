import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/queries/queryKeys";

/**
 * 레시피 변경(생성·수정·삭제·좋아요) 시 레시피 관련 쿼리만 무효화한다.
 * 앱 전체(invalidate(["drippin"]))를 리페치하던 비효율을 막는다.
 */
export const invalidateRecipeQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.recipeFeed() });
  queryClient.invalidateQueries({ queryKey: queryKeys.recipe() });
  queryClient.invalidateQueries({ queryKey: queryKeys.myRecipe() });
};

/**
 * 일지 변경(생성·수정·삭제·좋아요) 시 일지 관련 쿼리만 무효화한다.
 */
export const invalidateLogQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.logFeed() });
  queryClient.invalidateQueries({ queryKey: queryKeys.log() });
  queryClient.invalidateQueries({ queryKey: ["drippin", "logs", "my"] });
};
