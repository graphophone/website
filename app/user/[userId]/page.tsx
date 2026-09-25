import { Card } from "@/components/ui/card";
import UserProfileCard from "@/components/user/profileCard";
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
      <Card className="w-full pt-0 flex flex-col items-center justify-center">
        <UserProfileCard profile={profile} />
      </Card>
    </div>
  )
}

export default UserProfilePage