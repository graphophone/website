"use client"

import Link from "next/link"
import { SheetClose } from "@/components/ui/sheet"

interface Props {
    href: string
    children: React.ReactNode
}

function MobileMenuLink({ href, children }: Props) {
    return (
        <SheetClose
            nativeButton={false}
            render={<Link href={href} />}
            className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-[6px] px-2 text-left text-sm hover:bg-secondary"
        >
            {children}
        </SheetClose>
    )
}

export default MobileMenuLink
