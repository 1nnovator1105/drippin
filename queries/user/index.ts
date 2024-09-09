"use client";

import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { QueryClient, useQuery } from "@tanstack/react-query";

export const getUserByUsername = async (
  supabase: SupabaseClient,
  username: string,
) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) throw error;
  return data;
};

export const prefetchUserQuery = async (
  queryClient: QueryClient,
  username: string,
) => {
  const supabase = createClient();
  await queryClient.prefetchQuery({
    queryKey: ["user", username],
    queryFn: () => getUserByUsername(supabase, username),
  });
};

const getUser = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export default function useUserQueries() {
  const useGetUser = () => {
    return useQuery({
      queryKey: ["user"],
      queryFn: getUser,
    });
  };

  return { useGetUser };
}
