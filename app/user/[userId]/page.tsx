import UserProfileBanner from "@/components/user/profileBanner";
import { Profile } from "@/types/user/profile";
import { notFound } from "next/navigation";

async function UserProfilePage({ params }: { params: Promise<{ userId: number }> }) {
  const { userId } = await params;
  const res = await fetch(`${process.env.API_URL}/user/${userId}`);
  if (res.status !== 200) {
    notFound();
  }
  const profile: Profile = await res.json();

  return (
    <div className="w-full">
      <div className="w-full flex flex-col items-center justify-center">
        <UserProfileBanner profile={profile} />
      </div>
    </div>
  )
}

export default UserProfilePage