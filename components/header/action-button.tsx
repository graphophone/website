import React from 'react'

function HeaderActionButton({ children }: { children: React.ReactNode }) {
    return (
        <div className="select-none flex gap-1 items-center h-8 cursor-pointer hover:bg-[#D7A090] px-2 rounded-[6px] transition-all">
            {children}
        </div>
    )
}

export default HeaderActionButton