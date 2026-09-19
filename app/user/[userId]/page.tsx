import UserProfileView from "@/components/user/userProfileView";
import { UserProfile as IUserProfile } from "@/types/user/profile";
import { notFound } from "next/navigation";

async function UserProfile({ params }: { params: Promise<{ userId: number }> }) {
  const { userId } = await params;
  const res = await fetch(`${process.env.API_URL}/user/${userId}`);
  if (res.status !== 200) {
    notFound();
  }
  const profile: IUserProfile = await res.json();

  console.log({ profile })

  return (
    <div className="w-full">
      <UserProfileView profile={profile} />
    </div>
  )
}

export default UserProfile