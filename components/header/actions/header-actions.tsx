"use client"

import Image from 'next/image';
import { List } from 'phosphor-react'
import React, { useState } from 'react'
import AddAction from './add-action';
import NotificationsAction from './notifications-action';

function HeaderActions() {

    const [avatarUrl, setAvatarUrl] = useState('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.squarespace-cdn.com%2Fcontent%2Fv1%2F630285fccc5e0e5bfa0578af%2F410402b3-8eb9-4979-9628-603caef4d3c3%2Flambda480blue.png&f=1&nofb=1&ipt=181efa5954c43528236d0d36f8e231df7ab61c15bdc7d36d26410b9c23bf9971');

    return (
        <div className="flex gap-2 items-center">
            <HeaderActionButton>
                <AddAction />
            </HeaderActionButton>

            <HeaderActionButton>
                <NotificationsAction />
            </HeaderActionButton>

            <HeaderActionButton>
                <div className="hover:brightness-85 transition-all rounded-[6px] overflow-clip">
                    { avatarUrl ?
                        <Image src="/images/empty_avatar.jpg" alt="empty avatar" width={32} height={32} /> :
                        <Image src={avatarUrl} alt="user avatar" width={32} height={32} />
                    }
                </div>
            </HeaderActionButton>

            <HeaderActionButton>
                <List size={16} weight="bold" />
            </HeaderActionButton>
        </div>
    )
}

function HeaderActionButton({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center cursor-pointer w-8 h-8 transition-all hover:bg-[#FFDFB3] rounded-[6px]">
            {children}
        </div>
    )
}

export default HeaderActions