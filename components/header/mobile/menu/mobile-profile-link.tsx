"use client"

import Image from "next/image"
import S3Image from "@/components/s3Image"
import { BasicProfile } from "@/types/user/profile"
import MobileMenuLink from "./mobile-menu-link"

function MobileProfileLink({ user }: { user: BasicProfile }) {
    return (
        <MobileMenuLink href={`/user/${user.userId}`}>
            <div className="relative size-8 shrink-0 overflow-clip rounded-[6px]">
                {user.avatarUrl ? (
                    <S3Image
                        src={user.avatarUrl}
                        alt="user avatar"
                        fill={true}
                        style={{ objectFit: "cover" }}
                    />
                ) : (
                    <Image src="/images/empty_avatar.png" fill={true} alt="empty avatar" />
                )}
            </div>
            <span className="truncate">{user.username}</span>
        </MobileMenuLink>
    )
}

export default MobileProfileLink
