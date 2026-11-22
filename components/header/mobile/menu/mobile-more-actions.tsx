"use client"

import { useContext } from "react"
import { useRouter } from "next/navigation"
import {
    ChatCircle,
    DotsThree,
    MusicNote,
    Playlist,
    SignOut,
    ThumbsUp,
    UsersThree,
} from "phosphor-react"
import { UserContext } from "@/context/userContext"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import MobileMenuButton from "./mobile-menu-button"

function MobileMoreActions() {
    const router = useRouter()
    const userContext = useContext(UserContext)

    const handleLogout = async () => {
        const status = await userContext.logout()
        if (status === 200) {
            router.push("/")
        } else {
            console.log("Failed to logout")
        }
    }

    return (
        <Accordion className="rounded-none border-0 border-t pt-1">
            <AccordionItem value="more-actions" className="data-open:bg-transparent">
                <AccordionTrigger className="h-11 cursor-pointer items-center gap-3 rounded-[6px] px-2 text-sm font-normal hover:bg-secondary hover:no-underline">
                    <span className="flex items-center gap-3">
                        <DotsThree size={20} weight="bold" />
                        More actions
                    </span>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1 pb-0 pl-4">
                    <MobileMenuButton onClick={() => router.push(`/user/${userContext.user?.userId}/music`)}>
                        <MusicNote size={20} weight="fill" />
                        Uploads
                    </MobileMenuButton>
                    <MobileMenuButton onClick={() => router.push(`/user/${userContext.user?.userId}/likes`)}>
                        <ThumbsUp size={20} weight="fill" />
                        Liked
                    </MobileMenuButton>
                    <MobileMenuButton onClick={() => router.push(`/user/${userContext.user?.userId}/playlists`)}>
                        <Playlist size={20} weight="fill" />
                        Playlists
                    </MobileMenuButton>
                    <MobileMenuButton onClick={() => router.push(`/user/${userContext.user?.userId}/followers`)}>
                        <UsersThree size={20} weight="fill" />
                        Followers
                    </MobileMenuButton>
                    <MobileMenuButton onClick={() => router.push(`/user/${userContext.user?.userId}/comments`)}>
                        <ChatCircle size={20} weight="fill" />
                        Comments
                    </MobileMenuButton>
                    <MobileMenuButton onClick={handleLogout}>
                        <span className="flex items-center gap-3 text-destructive">
                            <SignOut size={20} />
                            Logout
                        </span>
                    </MobileMenuButton>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default MobileMoreActions
