"use client"

import { List, X } from "phosphor-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import MobileMenuEntries from "./mobile-menu-entries"

function MobileMenu() {
    return (
        <Sheet>
            <SheetTrigger
                render={<Button variant="ghost" size="icon" className="cursor-pointer" aria-label="Open menu" />}
            >
                <List size={20} color="var(--foreground)" />
            </SheetTrigger>

            <SheetContent
                side="right"
                showCloseButton={false}
                className="text-sm data-[side=right]:w-full data-[side=right]:sm:max-w-none"
            >
                <SheetHeader className="flex-row items-center justify-between px-4">
                    <SheetTitle className="text-base font-bold">Graphophone</SheetTitle>
                    <SheetClose
                        render={<Button variant="ghost" size="icon" className="cursor-pointer" aria-label="Close menu" />}
                    >
                        <X size={20} color="var(--foreground)" />
                    </SheetClose>
                </SheetHeader>

                <nav className="flex flex-col gap-1 overflow-y-auto px-4 pb-6">
                    <MobileMenuEntries />
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export default MobileMenu
