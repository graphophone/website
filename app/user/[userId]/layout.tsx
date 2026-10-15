import { Card } from "@/components/ui/card";
import UserProfileCard from "@/components/user/profileCard";
import UserProfileSections from "@/components/user/profileSections";
import { isRequestError } from "@/lib/error";
import { Profile } from "@/types/user/profile";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: Promise<{ userId: number }>,
  children: React.ReactNode,
}

async function UserProfileLayout(props: Props) {
  const { userId } = await props.params;
  const res = await fetch(`${process.env.API_URL}/user/${userId}`);
  if (isRequestError(res)) {
    notFound();
  }
  const profile: Profile = await res.json();
  return (
    <div className="w-full flex flex-col gap-4.5">
      <Card className="w-full py-0 flex flex-col items-center justify-center">
        <UserProfileCard profile={profile} />

        <UserProfileSections userId={userId} />
      </Card>

      <div className="w-full">
        {props.children}
      </div>
    </div>
  )
}

export default UserProfileLayout