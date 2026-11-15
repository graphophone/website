"use client"

import { UserContext } from "@/context/userContext";
import { FollowsCount, UserProfile } from "@/types/user/profile";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import S3Image from "../s3Image";
import { CaretDown, CaretUp } from "phosphor-react";
import { formatCompactCount } from "@/lib/utils";
import { followUserEndpoint, followsCountEndpoint } from "@/constants/api";
import { ToastContext } from "@/context/toastContext";
import { isRequestError } from "@/lib/error";
import { Skeleton } from "../ui/skeleton";

interface Props {
  profile: UserProfile;
}

function UserProfileCard({ profile }: Props) {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const [isBannerExpanded, setIsBannerExpanded] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followsCount, setFollowsCount] = useState<FollowsCount | null>(null);
  const [isFollowsCountLoading, setIsFollowsCountLoading] = useState(true);
  const isOwner = userContext.user?.userId === profile.userId;

  useEffect(() => {
    if (userContext.isLoading) {
      return;
    }

    const loadFollowsCount = async () => {
      setIsFollowsCountLoading(true);
      const response = await userContext.protectedFetch(followsCountEndpoint(profile.userId), {
        method: "GET",
      });

      if (isRequestError(response)) {
        setFollowsCount(null);
        setIsFollowed(false);
      } else {
        const newFollowsCount: FollowsCount = await response.json();
        setFollowsCount(newFollowsCount);
        setIsFollowed(newFollowsCount.isFollowed);
      }
      setIsFollowsCountLoading(false);
    };

    loadFollowsCount();
  }, [userContext.isLoading, userContext.user?.userId, profile.userId]);

  const handleFollow = async () => {
    const response = await userContext.protectedFetch(followUserEndpoint(profile.userId), {
      method: "PATCH",
    });
    if (isRequestError(response)) {
      toastContext.show({
        title: "Failed to follow user",
        type: "error",
      });
      return;
    }

    const newIsFollowed = !isFollowed;
    setIsFollowed(newIsFollowed);
    setFollowsCount(currentFollowsCount =>
      currentFollowsCount === null ? currentFollowsCount : {
        ...currentFollowsCount,
        followersCount: currentFollowsCount.followersCount + (newIsFollowed ? 1 : -1),
      }
    );
  };

  const displayName = profile.firstName ?
    `${profile.firstName} ${profile.lastName}`.trimEnd() :
    profile.lastName;

  const displayLocation = profile.city ?
    `${profile.city}${profile.country ? `, ${profile.country}` : ''}` :
    profile.country;

  return (
    <div className="w-full bg-background rounded-t-[8px] overflow-clip">
      { profile.bannerUrl ?
        <div className={`w-full relative ${isBannerExpanded ? 'h-40 md:h-87.5' : 'h-10.5'} overflow-clip`}>
          <div className="absolute flex items-center h-10.5 w-full justify-end pr-4 md:pr-16">
            <Button
              variant="outline"
              className="bg-background text-foreground
                hover:bg-background/90 z-20 cursor-pointer"
              onClick={() => setIsBannerExpanded(prev => !prev)}
            >
              Show banner
              { isBannerExpanded ? <CaretUp size={16} /> : <CaretDown size={16} /> }
            </Button>
          </div>
          { isBannerExpanded ?
            <></> : <div className="absolute z-10 w-full h-full bg-background/35" />
          }
          <div className="absolute w-full h-40 md:h-87.5">
            <S3Image
              className="absolute"
              src={profile.bannerUrl}
              alt={`${profile.username} banner`}
              fill={true}
              style={{objectFit: "cover"}}
            />
          </div>
        </div> : <></>
      }

      <div className="py-2 px-4 md:px-16 w-full flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="min-w-0 w-full flex items-center gap-3 md:gap-4.5">
          <div className="size-20 md:size-18 shrink-0 relative rounded-[6px] overflow-clip z-0">
            { profile.avatarUrl ?
              <S3Image
                src={profile.avatarUrl}
                alt={`${profile.username} avatar`}
                fill={true}
                style={{objectFit: "cover"}}
              /> :
              <Image
                src="/images/empty_avatar.png"
                alt="empty avatar"
                fill={true}
                style={{objectFit: "cover"}}
              />
            }
          </div>

          <div className="min-w-0 flex flex-col justify-center gap-1.5">
            <span className="truncate text-foreground font-bold text-lg md:text-xl">{profile.username}</span>
            <span className="truncate text-foreground/50">
              { [displayName, displayLocation]
                  .filter(v => !!v)
                  .join(' • ')
              }
            </span>
            { isFollowsCountLoading ?
              <Skeleton className="h-4 w-32" /> :
              followsCount === null ?
                <span className="truncate text-xs text-foreground/50">
                  Failed to get user follows counts
                </span> :
                <span className="truncate text-xs text-foreground/70">
                  <Link href={`/user/${profile.userId}/followers`} className="hover:brightness-75">
                    {formatCompactCount(followsCount.followersCount)} followers
                  </Link>
                  {" • "}
                  <Link href={`/user/${profile.userId}/followings`} className="hover:brightness-75">
                    {formatCompactCount(followsCount.followingsCount)} following
                  </Link>
                </span>
            }
          </div>
        </div>
        
        <div className="w-full md:w-auto shrink-0 flex flex-col md:flex-row gap-1.5">
          { isOwner ? <></> :
            <Button
              className="w-full md:w-auto md:min-w-32 rounded-[6px] cursor-pointer
                bg-primary hover:brightness-95 hover:bg-primary text-background text-[14px]"
              onClick={handleFollow}
              disabled={isFollowsCountLoading}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </Button>
          }

          { isOwner ?
            <Link href="/settings/profile" className="w-full md:w-auto">
              <Button
                className="w-full md:w-auto md:min-w-32 rounded-[6px] cursor-pointer
                  bg-foreground/85 hover:bg-foreground text-background text-[14px]"
              >
                Manage profile
              </Button>
            </Link> :
            <></>
          }
        </div>
      </div>
    </div>
  )
}

export default UserProfileCard