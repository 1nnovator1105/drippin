import { queryKeys } from "@/queries/queryKeys";
import getQueryClient from "@/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Timer from "./Timer";
import { useSupabaseServer } from "@/utils/supabase/server";
import { fetchRecipeDetail } from "@/queries/recipe";

// recipe/[recipeId]
export default async function RecipeTimerPage({
  params,
}: {
  params: { recipeId: string };
}) {
  const { recipeId } = params;
  const supabase = useSupabaseServer();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.recipeDetail(recipeId),
    queryFn: () => fetchRecipeDetail(supabase, recipeId),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Timer recipeId={recipeId} />
    </HydrationBoundary>
  );
}
