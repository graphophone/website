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
      <Link href={`/user/${profile.userId}`} className="w-max flex gap-2
        items-center justify-center bg-background rounded-[6px] pr-2 hover:brightness-75">
        <div className="transition-all
            flex justify-center items-center
            rounded-[6px] overflow-clip relative w-8 h-8"
        >
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

        <span>{ profile.username }</span>
      </Link>

      {canFollow && (
        <Button type="button" className="cursor-pointer">
          Follow
        </Button>
      )}
    </div>
  )
}

export default UserCard