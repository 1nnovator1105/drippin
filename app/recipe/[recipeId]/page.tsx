import { queryKeys } from "@/queries/queryKeys";
import { fetchRecipeDetail } from "@/queries/recipe";
import { fetchSession } from "@/queries/session";
import getQueryClient from "@/utils/getQueryClient";
import { useSupabaseServer } from "@/utils/supabase/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import RecipeDetail from "./RecipeDetail";

// recipe/[recipeId]
export default async function RecipeDetailPage({
  params,
}: {
  params: { recipeId: string };
}) {
  const { recipeId } = params;
  const queryClient = getQueryClient();
  const supabase = useSupabaseServer();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.session(),
    queryFn: () => fetchSession(supabase),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.recipeDetail(recipeId),
    queryFn: () => fetchRecipeDetail(supabase, recipeId),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <RecipeDetail recipeId={recipeId} />
    </HydrationBoundary>
  );
}
