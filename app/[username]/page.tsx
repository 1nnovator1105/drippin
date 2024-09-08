import { createClient } from "@/utils/supabase/server";

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isMyPage = user?.user_metadata.user_name === decodeURI(params.username);

  console.log(user?.user_metadata);

  if (isMyPage) {
    return (
      <div>
        <h1>My Profile, {user?.user_metadata.user_name}</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{decodeURI(params.username)}님의 Profile</h1>
      <p>안녕하세요. {user?.user_metadata.user_name}님</p>
    </div>
  );
}
