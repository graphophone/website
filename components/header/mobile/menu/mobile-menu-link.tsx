"use client"

import Link from "next/link"
import { SheetClose } from "@/components/ui/sheet"
import { mobileMenuItemClassName } from "./mobile-menu-item-styles"

interface Props {
    href: string
    children: React.ReactNode
}

function MobileMenuLink({ href, children }: Props) {
    return (
        <SheetClose
            nativeButton={false}
            render={<Link href={href} />}
            className={mobileMenuItemClassName}
        >
            {children}
        </SheetClose>
    )
}

export default MobileMenuLink
