"use client"

import { useContext } from "react"
import Link from "next/link"

import { UserContext } from "@/context/userContext"
import S3Image from "@/components/s3Image"
import Image from "next/image"
import AddAction from "./actions/add-action"
import NotificationsAction from "./actions/notifications-action"
import ThemeToggle from "./actions/theme-toggle"
import MobileMenuAccordion from "./mobile-menu-accordion"

function MobileHeaderActions({ onNavigate }: { onNavigate: () => void }) {
    const userContext = useContext(UserContext)

    if (userContext.isLoading) {
        return <div className="py-2">Loading ...</div>
    }

    if (userContext.user === null) {
        return (
            <div className="flex flex-col gap-3">
                <MobileActionRow label="Theme">
                    <ThemeToggle mobile />
                </MobileActionRow>
                <Link
                    href="/auth/login"
                    onClick={onNavigate}
                    className="flex h-10 w-full items-center justify-between rounded-[6px] px-2 transition-all hover:bg-secondary"
                >
                    <span>Login</span>
                </Link>
                <Link
                    href="/auth/sign-up"
                    onClick={onNavigate}
                    className="flex h-10 w-full items-center justify-between rounded-[6px] px-2 transition-all hover:bg-secondary"
                >
                    <span>Sign up</span>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            <MobileActionRow label="Theme">
                <ThemeToggle mobile />
            </MobileActionRow>
            <MobileActionRow label="Upload music">
                <AddAction onNavigate={onNavigate} mobile />
            </MobileActionRow>
            <MobileActionRow label="Notifications">
                <NotificationsAction onNavigate={onNavigate} mobile />
            </MobileActionRow>
            <Link
                href={`/user/${userContext.user.userId}`}
                onClick={onNavigate}
                className="flex h-10 w-full items-center justify-between rounded-[6px] px-2 transition-all hover:bg-secondary"
            >
                <span>Profile</span>
                <div className="relative h-8 w-8 overflow-hidden rounded-[6px]">
                    {userContext.user.avatarUrl ? (
                        <S3Image
                            src={userContext.user.avatarUrl}
                            alt="user avatar"
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    ) : (
                        <Image
                            src="/images/empty_avatar.jpg"
                            width={32}
                            height={32}
                            alt="empty avatar"
                        />
                    )}
                </div>
            </Link>
            <MobileMenuAccordion onNavigate={onNavigate} />
        </div>
    )
}

function MobileActionRow({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="relative flex h-10 w-full items-center justify-between rounded-[6px] px-2 transition-all hover:bg-secondary [&>div]:absolute [&>div]:inset-0 [&_button]:h-full [&_button]:w-full [&_a]:h-full [&_a]:w-full">
            <span className="pointer-events-none relative z-10">{label}</span>
            <div className="h-full w-full">
                {children}
            </div>
        </div>
    )
}

export default MobileHeaderActions
