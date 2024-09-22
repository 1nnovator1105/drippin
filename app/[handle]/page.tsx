import ProfileHeader from "@/components/profile/ProfileHeader";

export default async function UserProfilePage({
  params,
}: {
  params: { handle: string };
}) {
  // Neat! Serialization is now as easy as passing props.
  return <ProfileHeader handle={params.handle} />;
}
