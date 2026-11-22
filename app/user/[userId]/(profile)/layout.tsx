import { Card } from "@/components/ui/card";
import UserProfileCard from "@/components/user/profileCard";
import UserProfileSections from "@/components/user/profileSections";
import { isRequestError } from "@/lib/error";
import { UserProfile } from "@/types/user/profile";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: Promise<{ userId: number }>,
  children: React.ReactNode,
}

async function UserProfileLayout(props: Props) {
  const { userId } = await props.params;
  const res = await fetch(`${process.env.API_INTERNAL_URL}/user/${userId}`);
  if (isRequestError(res)) {
    notFound();
  }
  const profile: UserProfile = await res.json();
  return (
    <Card className="w-full h-max py-0 gap-0 flex flex-col">
      <UserProfileCard profile={profile} />

      <UserProfileSections userId={userId} />

      <div className="w-full px-4 py-4 md:px-16">
        {props.children}
      </div>
    </Card>
  )
}

export default UserProfileLayout