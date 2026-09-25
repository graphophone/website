"use client"

import { UserContext } from "@/context/userContext";
import { Profile } from "@/types/user/profile";
import Image from "next/image";
import { useContext } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import S3Image from "../s3Image";

interface Params {
  profile: Profile;
}

function UserProfileBanner({ profile }: Params) {
  const userContext = useContext(UserContext);
  const canEdit = userContext.user?.userId === profile.userId;
  const bannerUrl: string | null = "https://livedoor.blogimg.jp/newstimes_001/imgs/4/8/4865061a.jpg";

  const displayName = profile.firstName ?
    `${profile.firstName} ${profile.lastName}`.trimEnd() :
    profile.lastName;

  const displayLocation = profile.city ?
    `${profile.city}${profile.country ? `, ${profile.country}` : ''}` :
    profile.country;

  return (
    <div className="w-full bg-background relative h-45
      rounded-tl-[8px] rounded-tr-[8px] overflow-clip"
    >
      { bannerUrl ?
        <Image
          src={bannerUrl}
          alt={`${profile.username} banner`}
          fill={true}
          style={{objectFit: "cover"}}
        /> :
        <></>
      }

      <div className="w-full h-full flex items-center px-16 py-4.5 gap-4.5">
        <div className="w-36 h-36 relative rounded-full overflow-clip z-0">
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

        <div className="max-w-full h-full flex grow flex-col justify-between z-10">
          <div className="flex flex-col w-full gap-1.5">
            <UserProfileBannerLabel text={profile.username} isMain={displayName === null} />
            { displayName ?
              <UserProfileBannerLabel text={displayName} isMain={true} /> :
              <></>
            }
            { displayLocation ?
              <UserProfileBannerLabel text={displayLocation} isMain={false} /> :
              <></>
            }
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
    </div>
  )
}

interface UserProfileBannerLabelParams {
  text: string;
  isMain: boolean;
}

function UserProfileBannerLabel({ text, isMain }: UserProfileBannerLabelParams) {
  return (
    <div className={`bg-foreground/85 py-1 px-4 max-w-full w-min rounded-[6px]`}>
      { isMain ?
        <span className="whitespace-nowrap font-bold text-[18px] text-background">
          {text}
        </span> :
        <span className="whitespace-nowrap text-[14px] text-background">{text}</span>
      }
    </div>
  )
}

export default UserProfileBanner