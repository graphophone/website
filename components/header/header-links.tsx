'use client';

import { MagnifyingGlass, MusicNote, Rss } from "phosphor-react";
import Link from "next/link";

function HeaderLinks() {
    return (
        <div className="flex gap-4">
            <Link href="/music-catalog">
                <HeaderLink>
                    <MusicNote size={16} />
                    <span>Music catalog</span>
                </HeaderLink>
            </Link>

            <HeaderLink>
                <MagnifyingGlass size={16} />
                <span>Search</span>
            </HeaderLink>

            <Link href="/feed">
                <HeaderLink>
                    <Rss size={16} />
                    <span>Feed</span>
                </HeaderLink>
            </Link>
        </div>
    )
}

function HeaderLink({ children }: { children: React.ReactNode }) {
    return (
        <div className="select-none flex gap-1 items-center h-8 cursor-pointer hover:bg-secondary px-2 rounded-[6px] transition-all">
            {children}
        </div>
    )
}

export default HeaderLinks