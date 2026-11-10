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
import { cn } from "@/lib/utils"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import MobileMenuButton from "./mobile-menu-button"
import { mobileMenuItemClassName } from "./mobile-menu-item-styles"

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
                <AccordionTrigger className={cn(mobileMenuItemClassName, "font-normal hover:no-underline **:data-[slot=accordion-trigger-icon]:text-foreground")}>
                    <span className="flex items-center gap-3">
                        <DotsThree size={20} weight="bold" />
                        More actions
                    </span>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1 pb-0 pl-4">
                    <MobileMenuButton>
                        <MusicNote size={20} weight="fill" />
                        Uploads
                    </MobileMenuButton>
                    <MobileMenuButton>
                        <ThumbsUp size={20} weight="fill" />
                        Liked
                    </MobileMenuButton>
                    <MobileMenuButton>
                        <Playlist size={20} weight="fill" />
                        Playlists
                    </MobileMenuButton>
                    <MobileMenuButton>
                        <UsersThree size={20} weight="fill" />
                        Followers
                    </MobileMenuButton>
                    <MobileMenuButton>
                        <ChatCircle size={20} weight="fill" />
                        Comments
                    </MobileMenuButton>
                    <MobileMenuButton onClick={handleLogout} className="text-destructive">
                        <SignOut size={20} />
                        Logout
                    </MobileMenuButton>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default MobileMoreActions
