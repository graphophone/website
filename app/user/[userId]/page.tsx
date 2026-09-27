import { Card } from "@/components/ui/card";
import UserProfileCard from "@/components/user/profileCard";
import { isRequestError } from "@/lib/error";
import { Profile } from "@/types/user/profile";
import { notFound } from "next/navigation";

async function UserProfilePage({ params }: { params: Promise<{ userId: number }> }) {
  const { userId } = await params;
  const res = await fetch(`${process.env.API_URL}/user/${userId}`);
  if (isRequestError(res)) {
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