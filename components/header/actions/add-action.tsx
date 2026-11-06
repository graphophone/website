"use client"

import Link from "next/link"
import { MusicNote } from "phosphor-react"

function AddAction({ onNavigate, mobile = false }: { onNavigate?: () => void; mobile?: boolean }) {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Link
                href="/upload-music"
                onClick={onNavigate}
                className="relative flex h-full w-full items-center justify-end"
                aria-label="Upload music"
            >
                <span className={mobile
                    ? "absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center"
                    : ""
                }>
                    <MusicNote color="var(--foreground)" size={16} weight="fill" />
                </span>
            </Link>
        </div>
    )
}

export default AddAction