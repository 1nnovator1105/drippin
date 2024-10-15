import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";

export const fetchSession = async (supabaseClient: TypedSupabaseClient) => {
  try {
    const { data } = await supabaseClient.auth.getSession();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
