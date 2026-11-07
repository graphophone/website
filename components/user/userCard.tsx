"use client"

import { UserContext } from "@/context/userContext";
import { BasicProfile } from '@/types/user/profile'
import S3Image from '../s3Image'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from "react";
import { Button } from "../ui/button";

function UserCard({ profile }: { profile: BasicProfile }) {
  const userContext = useContext(UserContext);
  const canFollow = userContext.user?.userId !== profile.userId;

  return (
    <div className="w-fit flex items-center gap-2">
      <Link href={`/user/${profile.userId}`}>
        <div className="flex justify-center items-center rounded-[6px] overflow-clip relative w-8 h-8">
          { profile.avatarUrl ?
            <S3Image
              src={profile.avatarUrl}
              alt="user avatar"
              fill={true}
              style={{objectFit: "cover"}}
            /> :
            <Image
              src="/images/empty_avatar.jpg"
              fill={true}
              alt="empty avatar"
            />
          }
        </div>
      </Link>
      <div className="flex flex-col">
        <Link
          href={`/user/${profile.userId}`}
          className="w-max hover:brightness-75"
        >
          {profile.username}
        </Link>
        <span className="text-xs text-foreground/70">
          {profile.followersCount ?? 0} followers
        </span>
      </div>

      {canFollow && (
        <Button type="button" className="cursor-pointer">
          Follow
        </Button>
      )}
    </div>
  )
}

export default UserCard