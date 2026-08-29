"use client"

import Image from 'next/image';
import { BellSimple, List, Plus } from 'phosphor-react'
import React, { useState } from 'react'

function HeaderActions() {
    const [notificationsCount, setNotificationCount] = useState(15);
    const [avatarUrl, setAvatarUrl] = useState('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.squarespace-cdn.com%2Fcontent%2Fv1%2F630285fccc5e0e5bfa0578af%2F410402b3-8eb9-4979-9628-603caef4d3c3%2Flambda480blue.png&f=1&nofb=1&ipt=181efa5954c43528236d0d36f8e231df7ab61c15bdc7d36d26410b9c23bf9971');
    const [isNotificationsHovered, setIsNotificationsHovered] = useState(false);

    return (
        <div className="flex gap-2 items-center">
            <HeaderActionButton>
                <Plus size={16} weight="bold" />
            </HeaderActionButton>

            <HeaderActionButton>
                <div
                    onMouseEnter={() => { setIsNotificationsHovered(true) }}
                    onMouseLeave={() => { setIsNotificationsHovered(false) }}
                    className="w-full h-full flex items-center justify-center relative"
                >
                    <BellSimple weight="fill" size={16} />
                    { notificationsCount === 0 ? <></> :
                        <div
                            className={`${isNotificationsHovered ? "scale-0" : "scale-100"} transition-all
                                bg-red-500 w-4 h-4 absolute text-[10px] text-white font-bold
                                flex items-center justify-center rounded-full -top-px -right-px`
                            }
                        >
                            { notificationsCount > 9 ? '9+' : notificationsCount }
                        </div>
                    }
                </div>
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