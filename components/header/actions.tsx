'use client';

import { MagnifyingGlass, MusicNote, Rss } from "phosphor-react";
import HeaderActionButton from "./action-button";
import Link from "next/link";

function HeaderActions() {
    return (
        <div className="flex gap-4">
            <Link href="/music-catalog">
                <HeaderActionButton>
                    <MusicNote size={16} />
                    <span>Music catalog</span>
                </HeaderActionButton>
            </Link>

            <HeaderActionButton>
                <MagnifyingGlass size={16} />
                <span>Search</span>
            </HeaderActionButton>

            <Link href="/feed">
                <HeaderActionButton>
                        <Rss size={16} />
                        <span>Feed</span>
                </HeaderActionButton>
            </Link>
        </div>
    )
}

export default HeaderActions