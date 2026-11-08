import UserMusic from "@/components/user/userMusic";
import { isRequestError } from "@/lib/error";
import { Profile } from "@/types/user/profile";
import { notFound } from "next/navigation";

async function UserProfileMusicPage({ params }: { params: Promise<{ userId: number }> }) {
  const { userId } = await params;
  const res = await fetch(`${process.env.API_INTERNAL_URL}/user/${userId}`);
  if (isRequestError(res)) {
    notFound();
  }
  const profile: Profile = await res.json();

  return <UserMusic profile={profile} />;
}

export default UserProfileMusicPage;
