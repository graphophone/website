import React from 'react'

function GpHeader() {
    return (
        <div className="w-full flex flex-row items-center h-14 shadow-sm bg-[#FFF3E0] md:px-[10vw] px-2 justify-between">
            <span><b>Graphophone</b></span>

            <div className="flex flex-row gap-2">
                <div>
                    <span>Music catalog</span>
                </div>

                <div>
                    <span>Search</span>
                </div>

                <div>
                    <span>Feed</span>
                </div>
            </div>
        </div>
    )
}

export default GpHeader