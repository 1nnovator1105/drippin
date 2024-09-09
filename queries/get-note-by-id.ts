import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";

export function getUserByUserName(
  client: TypedSupabaseClient,
  user_name: string,
) {
  return client
    .from("profiles")
    .select(`*`)
    .eq("user_name", user_name)
    .throwOnError()
    .single();
}
