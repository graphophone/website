"use client"

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { UserContext } from '@/context/userContext'
import { useRouter } from 'next/navigation'
import { ChatCircle, List, MusicNote, Playlist, SignOut, ThumbsUp, UsersThree } from 'phosphor-react'
import React, { useContext } from 'react'

export function ListAction() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  
  const handleLogout = async () => {
    const status = await userContext.logout();
    if (status === 200) {
      router.push('/');
    } else {
      console.log('Failed to logout');
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="link" className="cursor-pointer">
          <List color="var(--foreground)" size={16} />
        </Button>
      } />

      <DropdownMenuContent className="w-50 rounded-[6px]" align="end">
        <DropdownMenuGroup>
          <ListActionItem onClick={() => router.push(`/user/${userContext.user?.userId}/music`)}>
            <MusicNote weight="fill" />
            <span className="text-sm">Uploads</span>
          </ListActionItem>
          <ListActionItem onClick={() => router.push(`/user/${userContext.user?.userId}/likes`)}>
            <ThumbsUp weight="fill" />
            <span className="text-sm">Liked</span>
          </ListActionItem>
          <ListActionItem onClick={() => router.push(`/user/${userContext.user?.userId}/playlists`)}>
            <Playlist weight="fill" />
            <span className="text-sm">Playlists</span>
          </ListActionItem>
          <ListActionItem onClick={() => router.push(`/user/${userContext.user?.userId}/followers`)}>
            <UsersThree weight="fill" />
            <span className="text-sm">Followers</span>
          </ListActionItem>
          <ListActionItem onClick={() => router.push(`/user/${userContext.user?.userId}/comments`)}>
            <ChatCircle weight="fill" />
            <span className="text-sm">Comments</span>
          </ListActionItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ListActionItem
            variant="destructive"
            onClick={handleLogout}
          >
            <SignOut color="var(--destructive)" />
            <span className="text-sm text-destructive">Logout</span>
          </ListActionItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ListActionItemProps {
  children: React.ReactNode,
  onClick?: () => void,
  variant?: "default" | "destructive",
}

function ListActionItem({ children, onClick, variant }: ListActionItemProps) {
  return (
    <DropdownMenuItem
      variant={variant}
      className="w-full flex gap-4 items-center cursor-pointer
        rounded-[6px] hover:bg-primary-foreground"
      onClick={() => {
        if (onClick !== undefined) {
          onClick();
        }
      }}
    >
      {children}
    </DropdownMenuItem>
  )
}

export default ListAction
