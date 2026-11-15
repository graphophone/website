import UserFollows from "@/components/user/userFollows";
import { isRequestError } from "@/lib/error";
import { UserProfile } from "@/types/user/profile";
import { notFound } from "next/navigation";

async function UserProfileFollowersPage({ params }: { params: Promise<{ userId: number }> }) {
  const { userId } = await params;
  const res = await fetch(`${process.env.API_INTERNAL_URL}/user/${userId}`);
  if (isRequestError(res)) {
    notFound();
  }
  const profile: UserProfile = await res.json();

  return <UserFollows profile={profile} type="followers" />;
}

export default UserProfileFollowersPage;
