import HomeWrapper from "@/components/home/HomeWrapper";
import { useSupabaseServer } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = useSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <HomeWrapper />;
}
