'use client';

import { MagnifyingGlass, MusicNote, Rss } from "phosphor-react";

function HeaderActions() {
    return (
        <div className="flex gap-4">
            <div className="flex gap-1 items-center h-8 cursor-pointer hover:bg-[#D7A090] px-2 rounded-[6px]">
                <MusicNote size={16} />
                <span>Music catalog</span>
            </div>

            <div className="flex gap-1 items-center h-8 cursor-pointer hover:bg-[#D7A090] px-2 rounded-[6px]">
                <MagnifyingGlass size={16} />
                <span>Search</span>
            </div>

            <div className="flex gap-1 items-center h-8 cursor-pointer hover:bg-[#D7A090] px-2 rounded-[6px]">
                <Rss size={16} />
                <span>Feed</span>
            </div>
        </div>
    )
}

export default HeaderActions