"use client";

import React, { useContext } from 'react'
import AddAction from './add-action';
import NotificationsAction from './notifications-action';
import UserAction from './user-action';
import ListAction from './list-action';
import { UserContext } from '@/context/userContext';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function HeaderActions() {
    const userContext = useContext(UserContext);

    if (userContext.isLoading) {
        return (
            <div className="flex gap-2 items-center">
                <Spinner />

                <span className="text-foreground">Loading ...</span>
            </div>
        )
    }

    if (userContext.user === null) {
        return (
            <div className="flex gap-2 items-center">
                <Link href="/auth/login">
                    <Button variant="ghost" className="cursor-pointer h-8 px-2">
                        <span className="text-md">Login</span>
                    </Button>
                </Link>
                <Link href="/auth/sign-up">
                    <Button variant="ghost" className="cursor-pointer">
                        <span>Sign up</span>
                    </Button>
                </Link>
            </div>
        )
    }

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
                <ListAction />
            </HeaderActionButton>
        </div>
    )
}

function HeaderActionButton({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center
            cursor-pointer w-8 h-8 transition-all
            hover:bg-secondary rounded-[6px]">
            {children}
        </div>
    )
}

export default HeaderActions