"use client"

import { useFollow } from "@/hooks/use-follow";
import { cn, formatCompactCount } from "@/lib/utils";
import { BasicProfile } from "@/types/user/profile";
import S3Image from "../s3Image";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

function UserCard({ profile }: { profile: BasicProfile }) {
  const { followsCount, isFollowed, canFollow, toggleFollow } = useFollow(profile);

  return (
    <Card className="w-full p-3 md:p-4">
      <div className="flex w-full min-w-0 items-center gap-3 md:gap-4">
        <Link
          href={`/user/${profile.userId}`}
          className="relative size-16 shrink-0 overflow-clip rounded-[6px] md:size-20"
        >
          {profile.avatarUrl ? (
            <S3Image
              src={profile.avatarUrl}
              alt={`${profile.username} avatar`}
              fill={true}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Image src="/images/empty_avatar.png" fill={true} alt="empty avatar" />
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Link
            href={`/user/${profile.userId}`}
            className="truncate text-lg font-bold hover:brightness-75 md:text-xl"
            title={profile.username}
          >
            {profile.username}
          </Link>
          {followsCount ? (
            <span className="truncate text-sm text-foreground/50">
              {formatCompactCount(followsCount.followersCount)} followers
              {" • "}
              {formatCompactCount(followsCount.followingsCount)} following
            </span>
          ) : followsCount === null && (
            <span className="truncate text-sm text-foreground/50">
              Failed to get user follows counts
            </span>
          )}
        </div>

        {canFollow && (
          <Button
            type="button"
            className={cn(
              "shrink-0 cursor-pointer rounded-[6px] text-[14px] text-background md:min-w-32",
              isFollowed ?
                "bg-foreground/85 hover:bg-foreground" :
                "bg-primary hover:bg-primary hover:brightness-95",
            )}
            onClick={toggleFollow}
          >
            {isFollowed ? "Following" : "Follow"}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default UserCard;
