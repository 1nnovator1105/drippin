import ModalOpenTestBtn from "@/components/button/ModalOpenTestBtn";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4">
        <h1>Hello World - Drippin</h1>
        <h3>{user?.user_metadata?.full_name}님 환영합니다.</h3>
        <ModalOpenTestBtn />
      </div>
    </>
  );
}
