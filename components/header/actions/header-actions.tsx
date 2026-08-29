"use client"

import Image from 'next/image';
import { List } from 'phosphor-react'
import React, { useState } from 'react'
import AddAction from './add-action';
import NotificationsAction from './notifications-action';
import UserAction from './user-action';

function HeaderActions() {
    return (
        <div className="flex gap-2 items-center">
            <HeaderActionButton>
                <AddAction />
            </HeaderActionButton>

            <HeaderActionButton>
                <NotificationsAction />
            </HeaderActionButton>

            <HeaderActionButton>
                <UserAction />
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