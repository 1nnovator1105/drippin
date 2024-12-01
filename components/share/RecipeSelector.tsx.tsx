import { fetchRecipeFeed } from "@/queries/feed";
import { queryKeys } from "@/queries/queryKeys";
import useSupabaseBrowser from "@/utils/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import Select from "react-select";

interface RecipeSelectorProps {
  value: any;
  setValue: (value: any) => void;
}

export default function RecipeSelector({
  value,
  setValue,
}: RecipeSelectorProps) {
  const supabase = useSupabaseBrowser();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<any>([]);

  const recipeFeedQuery = useInfiniteQuery({
    queryKey: queryKeys.recipeFeed(),
    queryFn: ({ pageParam }) => fetchRecipeFeed(supabase, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage: number | undefined = lastPage?.length
        ? allPages?.length
        : undefined;
      return nextPage;
    },
    initialPageParam: 0,
  });

  const makeOptionsFromQuery = (data: any) => {
    if (data) {
      const options = data.pages.flatMap((page: any) =>
        page!.map((recipe: any) => ({
          label: recipe.recipe_name,
          value: recipe.id,
        })),
      );
      setOptions(options);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    makeOptionsFromQuery(recipeFeedQuery.data);
  }, [recipeFeedQuery.data]);

  return (
    <Select
      options={options}
      captureMenuScroll={true}
      onMenuScrollToTop={() => {
        if (recipeFeedQuery.hasNextPage) {
          recipeFeedQuery.fetchPreviousPage();
        }
      }}
      onMenuScrollToBottom={() => {
        if (recipeFeedQuery.hasNextPage) {
          recipeFeedQuery.fetchNextPage();
        }
      }}
      isLoading={isLoading}
      placeholder="레시피를 선택해주세요"
      value={value}
      onChange={setValue}
    />
  );
}
