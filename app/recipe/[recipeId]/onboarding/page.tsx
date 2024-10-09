import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Onboarding from "./Onboarding";
import getQueryClient from "@/utils/getQueryClient";
import { queryKeys } from "@/queries/queryKeys";
import { useSupabaseServer } from "@/utils/supabase/server";
import { fetchRecipeDetail } from "@/queries/recipe";

export default async function RecipeOnboardingPage({
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
      <Onboarding recipeId={recipeId} />
    </HydrationBoundary>
  );
}
