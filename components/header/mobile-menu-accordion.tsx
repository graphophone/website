"use client"

import { useState, useContext } from "react"
import { Bell, CaretDown, ChatCircle, List, MusicNote, Playlist, SignOut, ThumbsUp, User, UsersThree } from "phosphor-react"
import { useRouter } from "next/navigation"

import { UserContext } from "@/context/userContext"

function MobileMenuAccordion({ onNavigate }: { onNavigate: () => void }) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const userContext = useContext(UserContext)

    const handleLogout = async () => {
        const status = await userContext.logout()
        if (status === 200) {
            onNavigate()
            router.push("/")
        } else {
            console.log("Failed to logout")
        }
    }

    return (
        <div className="w-full rounded-[6px] border-t border-border pt-3">
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen(value => !value)}
                className="flex h-10 w-full cursor-pointer items-center justify-between px-2"
            >
                <span>Additional actions</span>
                <span className="flex items-center gap-2">
                    <List size={16} />
                    <CaretDown className={`transition-transform ${open ? "rotate-180" : ""}`} size={16} />
                </span>
            </button>
            {open && (
                <div className="flex flex-col gap-1 border-t border-border px-2 py-2">
                    <MobileMenuItem onClick={onNavigate}><User weight="fill" /><span>My profile</span></MobileMenuItem>
                    <MobileMenuItem onClick={onNavigate}><MusicNote weight="fill" /><span>Uploads</span></MobileMenuItem>
                    <MobileMenuItem onClick={onNavigate}><ThumbsUp weight="fill" /><span>Liked</span></MobileMenuItem>
                    <MobileMenuItem onClick={onNavigate}><Playlist weight="fill" /><span>Playlists</span></MobileMenuItem>
                    <MobileMenuItem onClick={onNavigate}><UsersThree weight="fill" /><span>Followers</span></MobileMenuItem>
                    <MobileMenuItem onClick={onNavigate}><ChatCircle weight="fill" /><span>Comments</span></MobileMenuItem>
                    <MobileMenuItem onClick={onNavigate}><Bell weight="fill" /><span>Notifications</span></MobileMenuItem>
                    <MobileMenuItem onClick={handleLogout} destructive><SignOut /><span>Logout</span></MobileMenuItem>
                </div>
            )}
        </div>
    )
}

function MobileMenuItem({
    children,
    onClick,
    destructive = false,
}: {
    children: React.ReactNode
    onClick?: () => void
    destructive?: boolean
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-[6px] px-2 py-2 text-left hover:bg-primary-foreground${destructive ? " text-destructive" : ""}`}
        >
            {children}
        </button>
    )
}

export default MobileMenuAccordion
