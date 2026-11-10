"use client"

import { useTheme } from "next-themes"
import { Moon } from "phosphor-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { mobileMenuItemClassName } from "./mobile-menu-item-styles"

function MobileThemeSwitch() {
    const { resolvedTheme, setTheme } = useTheme()

    return (
        <label className={cn(mobileMenuItemClassName, "justify-between")}>
            <span className="flex items-center gap-3">
                <Moon size={20} weight="fill" />
                Dark theme
            </span>
            <Switch
                checked={resolvedTheme === "dark"}
                onCheckedChange={isChecked => setTheme(isChecked ? "dark" : "light")}
            />
        </label>
    )
}

export default MobileThemeSwitch
