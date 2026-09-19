"use client"

import { UserContext } from '@/context/userContext';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

function UserAction() {
    const userContext = useContext(UserContext);

    return (
        <Link href={`/user/${userContext.user?.id}`} className="w-full h-full flex justify-center items-center">
            <div className="hover:brightness-85 transition-all
                w-full h-full flex justify-center items-center
                rounded-[6px] overflow-clip relative"
            >
                { userContext.user?.avatarUrl ?
                    <Image
                        src={userContext.user.avatarUrl}
                        alt="user avatar"
                        fill={true}
                        style={{objectFit: "cover"}}
                    /> :
                    <Image
                        src="/images/empty_avatar.jpg"
                        width={32}
                        height={32}
                        alt="empty avatar"
                    />
                }
            </div>
        </Link>
    )
}

export default UserAction