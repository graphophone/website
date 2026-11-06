"use client"

import { MagnifyingGlass, MusicNote } from "phosphor-react"
import Link from "next/link"

function MobileHeaderLinks({ onNavigate }: { onNavigate: () => void }) {
    return (
        <div className="mb-6 flex flex-col gap-3">
            <Link
                href="/music-catalog"
                onClick={onNavigate}
                className="flex h-10 w-full items-center gap-2 rounded-[6px] px-2 transition-all hover:bg-secondary"
            >
                <MusicNote size={16} />
                <span>Music catalog</span>
            </Link>
            <button
                type="button"
                className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-[6px] px-2 text-left transition-all hover:bg-secondary"
            >
                <MagnifyingGlass size={16} />
                <span>Search</span>
            </button>
        </div>
    )
}

export default MobileHeaderLinks
