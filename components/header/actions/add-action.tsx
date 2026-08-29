"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { MusicNote, Playlist, Plus } from "phosphor-react"

function AddAction() {
    const actions = [
        {
            label: "Upload track",
            icon: <MusicNote />,
            href: "/upload-track",
        },
        {
            label: "Create new playlist",
            icon: <Playlist />,
            href: "/create-playlist",
        },
    ]

    return (
        <div className="w-full h-full flex justify-center items-center">
            <DropdownMenu>
                <DropdownMenuTrigger render={
                    <Button variant="link" className="cursor-pointer">
                        <Plus size={16} weight="bold" />
                    </Button>
                } />
                <DropdownMenuContent className="w-40" align="end">
                    <DropdownMenuGroup>
                        {actions.map((action, i) => (
                            <Link key={i} href={action.href}>
                                <DropdownMenuItem className="cursor-pointer">
                                    {action.icon}
                                    <span>{action.label}</span>
                                </DropdownMenuItem>
                            </Link>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default AddAction