"use client"

import { BellSimple } from 'phosphor-react';
import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';

function NotificationsAction() {
    const notifications = Array.from({ length: 10 }).map((_, i) => (
        {
            title: `Notification ${i}`,
            description: "Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah",
        }
    ));
    const [isNotificationsHovered, setIsNotificationsHovered] = useState(false);

    return (
        <div className="w-full h-full flex justify-center items-center">
            <DropdownMenu>
                <DropdownMenuTrigger render={
                    <Button
                        variant="link"
                        onMouseEnter={() => { setIsNotificationsHovered(true) }}
                        onMouseLeave={() => { setIsNotificationsHovered(false) }}
                        className="w-full h-full flex items-center justify-center relative cursor-pointer"
                    >
                        <BellSimple weight="fill" size={16} />
                        { notifications.length === 0 ? <></> :
                            <div
                                className={`${isNotificationsHovered ? "scale-0" : "scale-100"} transition-all
                                    bg-red-500 w-4 h-4 absolute text-[10px] text-white font-bold
                                    flex items-center justify-center rounded-full -top-px -right-px`
                                }
                            >
                                { notifications.length > 9 ? '9+' : notifications.length }
                            </div>
                        }
                    </Button>
                } />
                <DropdownMenuContent className="w-60" align="end">
                    <DropdownMenuGroup>
                        {notifications.map((notification, i) => (
                            <DropdownMenuItem key={i} className="cursor-pointer flex flex-col items-baseline gap-1">
                                <b className="w-[70%] text-ellipsis ">{notification.title}</b>
                                <div className="text-ellipsis line-clamp-2">{notification.description}</div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default NotificationsAction