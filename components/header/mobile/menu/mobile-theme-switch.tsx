"use client"

import { useTheme } from "next-themes"
import { Moon } from "phosphor-react"
import { Switch } from "@/components/ui/switch"

function MobileThemeSwitch() {
    const { resolvedTheme, setTheme } = useTheme()

    return (
        <label className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-[6px] px-2 text-sm hover:bg-secondary">
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
