import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";

export const fetchSession = async (supabaseClient: TypedSupabaseClient) => {
  const { data } = await supabaseClient.auth.getSession();
  return data;
};
