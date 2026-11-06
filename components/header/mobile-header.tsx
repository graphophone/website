"use client"

import { ListIcon, XIcon } from "@phosphor-icons/react"
import { useState } from "react"
import Link from "next/link"

import MobileHeaderActions from "./mobile-header-actions"
import MobileHeaderLinks from "./mobile-header-links"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

function MobileHeader() {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex h-14 w-full items-center justify-between bg-muted-foreground px-2 shadow-sm md:hidden">
            <Link href="/" className="cursor-pointer">
                <b className="select-none transition-all hover:opacity-50">Graphophone</b>
            </Link>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger
                    render={
                        <Button variant="ghost" size="icon" aria-label="Open menu" />
                    }
                >
                    <ListIcon />
                </SheetTrigger>
                <SheetContent side="left" showCloseButton={false} className="!w-screen !max-w-none overflow-hidden">
                    <SheetHeader className="shrink-0 flex-row items-center justify-between px-6">
                        <SheetTitle>Graphophone</SheetTitle>
                        <SheetClose
                            render={
                                <Button variant="ghost" size="icon-sm" aria-label="Close menu" />
                            }
                        >
                            <XIcon />
                        </SheetClose>
                    </SheetHeader>
                    <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
                        <MobileHeaderLinks onNavigate={() => setOpen(false)} />
                        <MobileHeaderActions onNavigate={() => setOpen(false)} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileHeader
