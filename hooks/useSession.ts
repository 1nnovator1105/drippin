"use client";

import { useQuery } from "@tanstack/react-query";
import useSupabaseBrowser from "@/utils/supabase/client";
import { queryKeys } from "@/queries/queryKeys";
import { fetchSession } from "@/queries/session";

/**
 * 현재 로그인 세션 쿼리. 여러 컴포넌트에서 제각각이던 세션 useQuery를
 * 단일 키(queryKeys.session())로 통일한다.
 */
export default function useSession() {
  const supabase = useSupabaseBrowser();

  return useQuery({
    queryKey: queryKeys.session(),
    queryFn: () => fetchSession(supabase),
  });
}
