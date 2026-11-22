"use client"

import { SheetClose } from "@/components/ui/sheet"

interface Props {
    children: React.ReactNode
    onClick?: () => void
}

function MobileMenuButton({ children, onClick }: Props) {
    return (
        <SheetClose
            onClick={onClick}
            className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-[6px] px-2 text-left text-sm hover:bg-secondary"
        >
            {children}
        </SheetClose>
    )
}

export default MobileMenuButton
