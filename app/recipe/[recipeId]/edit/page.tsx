import { queryKeys } from "@/queries/queryKeys";
import { fetchRecipeDetail } from "@/queries/recipe";
import getQueryClient from "@/utils/getQueryClient";
import { useSupabaseServer } from "@/utils/supabase/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import EditRecipe from "./EditRecipe";

export default async function EditRecipePage({
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

  console.log(recipeId);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <EditRecipe recipeId={recipeId} />
    </HydrationBoundary>
  );
}
