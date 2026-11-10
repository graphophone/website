"use client"

import Link from "next/link"
import { MusicNote } from "phosphor-react"

function AddAction() {
    return (
        <Link
            href="/upload-music"
            className="w-full h-full flex justify-center items-center"
            aria-label="Upload music"
        >
            <MusicNote color="var(--foreground)" size={16} weight="fill" />
        </Link>
    )
}

export default AddAction
