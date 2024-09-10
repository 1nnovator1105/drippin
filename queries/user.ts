import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";

export function getUserByUserName(
  client: TypedSupabaseClient,
  username: string,
) {
  return client
    .from("profiles")
    .select(
      `
        *
      `,
    )
    .eq("user_name", decodeURIComponent(username))
    .throwOnError()
    .single();
}
