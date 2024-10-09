export const queryKeys = {
  drippin: ["drippin"] as const,

  recipe: () => [...queryKeys.drippin, "recipe"] as const,
  log: () => [...queryKeys.drippin, "log"] as const,
  session: () => [...queryKeys.drippin, "session"] as const,

  myRecipe: () => [...queryKeys.session(), "recipe"] as const,
  myLog: () => [...queryKeys.session(), "log"] as const,

  recipeDetail: (recipeId: string) =>
    [...queryKeys.recipe(), recipeId] as const,
  logDetail: (logId: string) => [...queryKeys.log(), logId] as const,
};
