"use client"

import { UserContext } from '@/context/userContext';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

function UserAction() {
    const userContext = useContext(UserContext);

    return (
        <Link href={`/me`}>
            <div className="hover:brightness-85 transition-all
                rounded-[6px] overflow-clip"
            >
                { userContext.user?.avatarUrl ?
                    <Image src={userContext.user.avatarUrl} alt="user avatar" width={32} height={32} /> :
                    <Image src="/images/empty_avatar.jpg" alt="empty avatar" width={32} height={32} />
                }
            </div>
        </Link>
    )
}

export default UserAction