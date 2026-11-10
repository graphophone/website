"use client"

import { useContext } from "react"
import { BellSimple, MusicNote, SignIn, UserPlus } from "phosphor-react"
import { UserContext } from "@/context/userContext"
import { Spinner } from "@/components/ui/spinner"
import MobileMenuLink from "./mobile-menu-link"
import MobileProfileLink from "./mobile-profile-link"
import MobileThemeSwitch from "./mobile-theme-switch"
import MobileMoreActions from "./mobile-more-actions"

function MobileMenuEntries() {
    const userContext = useContext(UserContext)

    if (userContext.isLoading) {
        return (
            <div className="flex justify-center py-4">
                <Spinner className="size-6" />
            </div>
        )
    }

    if (userContext.user === null) {
        return (
            <>
                <MobileMenuLink href="/auth/login">
                    <SignIn size={20} />
                    Login
                </MobileMenuLink>
                <MobileMenuLink href="/auth/sign-up">
                    <UserPlus size={20} />
                    Sign up
                </MobileMenuLink>
                <MobileThemeSwitch />
            </>
        )
    }

    return (
        <>
            <MobileProfileLink user={userContext.user} />
            <MobileMenuLink href="/upload-music">
                <MusicNote size={20} weight="fill" />
                Upload music
            </MobileMenuLink>
            <MobileMenuLink href="/notifications">
                <BellSimple size={20} weight="fill" />
                Notifications
            </MobileMenuLink>
            <MobileThemeSwitch />
            <MobileMoreActions />
        </>
    )
}

export default MobileMenuEntries
