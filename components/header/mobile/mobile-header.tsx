"use client"

import Link from "next/link"
import { MagnifyingGlass } from "phosphor-react"
import { Button } from "@/components/ui/button"
import MobileMenu from "./menu/mobile-menu"

function MobileHeader() {
    return (
        <div className="w-full flex md:hidden items-center justify-between
            h-14 px-2 shadow-sm bg-muted-foreground">
            <Link href="/" className="cursor-pointer">
                <b className="select-none">Graphophone</b>
            </Link>

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="cursor-pointer" aria-label="Search">
                    <MagnifyingGlass size={20} color="var(--foreground)" />
                </Button>

                <MobileMenu />
            </div>
        </div>
    )
}

export default MobileHeader
