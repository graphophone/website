"use client"

import { cn } from "@/lib/utils"
import { SheetClose } from "@/components/ui/sheet"
import { mobileMenuItemClassName } from "./mobile-menu-item-styles"

interface Props {
    children: React.ReactNode
    onClick?: () => void
    className?: string
}

function MobileMenuButton({ children, onClick, className }: Props) {
    return (
        <SheetClose onClick={onClick} className={cn(mobileMenuItemClassName, className)}>
            {children}
        </SheetClose>
    )
}

export default MobileMenuButton
