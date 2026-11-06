"use client"

import { useContext } from "react"
import Link from "next/link"
import { BellSimple, MusicNote, Moon, Sun } from "phosphor-react"
import { useTheme } from "next-themes"

import { UserContext } from "@/context/userContext"
import S3Image from "@/components/s3Image"
import Image from "next/image"
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
                    <MobileThemeToggle />
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
                <MobileThemeToggle />
            </MobileActionRow>
            <MobileActionRow label="Upload music">
                <MobileLink href="/upload-music" onNavigate={onNavigate}>
                    <MusicNote color="var(--foreground)" size={16} weight="fill" />
                </MobileLink>
            </MobileActionRow>
            <MobileActionRow label="Notifications">
                <MobileLink href="/notifications" onNavigate={onNavigate}>
                    <BellSimple color="var(--foreground)" size={16} weight="fill" />
                </MobileLink>
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

function MobileThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    const isDark = resolvedTheme === "dark"

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="absolute inset-0 flex cursor-pointer items-center justify-end px-2"
        >
            <span className="flex h-8 w-8 items-center justify-center">
                <Sun size={16} className="hidden dark:block" color="var(--foreground)" />
                <Moon size={16} className="dark:hidden" color="var(--foreground)" />
            </span>
        </button>
    )
}

function MobileLink({
    href,
    onNavigate,
    children,
}: {
    href: string
    onNavigate: () => void
    children: React.ReactNode
}) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className="absolute inset-0 flex cursor-pointer items-center justify-end px-2"
        >
            <span className="flex h-8 w-8 items-center justify-center">
                {children}
            </span>
        </Link>
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
