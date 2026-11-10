"use client";

import { Moon, Sun } from "phosphor-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <Button
            type="button"
            variant="link"
            className="cursor-pointer w-full h-full"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            title="Toggle theme"
        >
            <Sun size={16} className="hidden dark:block" color="var(--foreground)" />
            <Moon size={16} className="dark:hidden" color="var(--foreground)" />
        </Button>
    );
}

export default ThemeToggle;
