import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";

export function getUserByHandle(client: TypedSupabaseClient, handle: string) {
  return client
    .from("profiles")
    .select(
      `
        *
      `,
    )
    .eq("handle", handle)
    .throwOnError()
    .single();
}

export async function fetchMySelf(client: TypedSupabaseClient, userId: string) {
  return client
    .from("profiles")
    .select(
      `
        *
      `,
    )
    .eq("id", userId)
    .throwOnError()
    .single();
}
