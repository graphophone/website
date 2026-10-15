"use client"

import { UserContext } from "@/context/userContext";
import { Profile } from "@/types/user/profile";
import Image from "next/image";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import S3Image from "../s3Image";
import { CaretDown, CaretUp } from "phosphor-react";

interface Params {
  profile: Profile;
}

function UserProfileCard({ profile }: Params) {
  const userContext = useContext(UserContext);
  const [isBannerExpanded, setIsBannerExpanded] = useState(false);
  const canEdit = userContext.user?.userId === profile.userId;

  const displayName = profile.firstName ?
    `${profile.firstName} ${profile.lastName}`.trimEnd() :
    profile.lastName;

  const displayLocation = profile.city ?
    `${profile.city}${profile.country ? `, ${profile.country}` : ''}` :
    profile.country;

  return (
    <div className="w-full bg-background rounded-t-[8px] overflow-clip">
      { profile.bannerUrl ?
        <div className={`w-full relative ${isBannerExpanded ? 'h-87.5' : 'h-10.5'} overflow-clip`}>
          <div className="absolute flex items-center h-10.5 w-full justify-end pr-16">
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
          <div className="absolute w-full h-87.5">
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

      <div className="py-2 px-16 w-full h-full flex items-center justify-between">
        <div className="w-full h-full flex items-center gap-4.5">
          <div className="w-18 h-18 relative rounded-[6px] overflow-clip z-0">
            { profile.avatarUrl ?
              <S3Image
                src={profile.avatarUrl}
                alt={`${profile.username} avatar`}
                fill={true}
                style={{objectFit: "cover"}}
              /> :
              <Image
                src="/images/empty_avatar.jpg"
                alt="empty avatar"
                fill={true}
                style={{objectFit: "cover"}}
              />
            }
          </div>

          <div className="flex flex-col w-max h-18 justify-center gap-1.5">
            <span className="text-foreground font-bold text-xl">{profile.username}</span>
            <span className="text-foreground/50">
              { [displayName, displayLocation]
                  .filter(v => !!v)
                  .join(' • ')
              }
            </span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-1.5">
          <Button
            className="md:min-w-32 rounded-[6px] cursor-pointer
              bg-primary hover:brightness-95 hover:bg-primary text-background text-[14px]"
          >
            Follow
          </Button>

          { canEdit ?
            <Link href="/settings/profile">
              <Button
                className="md:min-w-32 rounded-[6px] cursor-pointer
                  bg-foreground/85 hover:bg-foreground text-background text-[14px]"
              >
                Edit profile
              </Button>
            </Link> :
            <></>
          }
        </div>
      </div>
    </div>
  )
}

interface UserProfileBannerLabelParams {
  text: string;
  isMain: boolean;
}

export default UserProfileCard