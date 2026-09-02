import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Bell, ChatCircle, List, MusicNote, Playlist, SignOut, ThumbsUp, User, UsersThree } from 'phosphor-react'
import React from 'react'

export function ListAction() {
  const userData = {
    id: 123,
    username: "forget-me-not",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="link" className="cursor-pointer">
          <List size={16} />
        </Button>
      } />

      <DropdownMenuContent className="w-50 rounded-[6px]" align="end">
        <DropdownMenuGroup>
          <ListActionItem>
            <User weight="fill" />
            <div className="flex flex-col w-full">
              <span className="opacity-50 text-2xs">My profile</span>
              <span className="text-sm line-clamp-1">{userData.username}</span>
            </div>
          </ListActionItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ListActionItem>
            <MusicNote weight="fill" />
            <span className="text-sm">Uploads</span>
          </ListActionItem>
          <ListActionItem>
            <ThumbsUp weight="fill" />
            <span className="text-sm">Liked</span>
          </ListActionItem>
          <ListActionItem>
            <Playlist weight="fill" />
            <span className="text-sm">Playlists</span>
          </ListActionItem>
          <ListActionItem>
            <UsersThree weight="fill" />
            <span className="text-sm">Followers</span>
          </ListActionItem>
          <ListActionItem>
            <ChatCircle weight="fill" />
            <span className="text-sm">Comments</span>
          </ListActionItem>
          <ListActionItem>
            <Bell weight="fill" />
            <span className="text-sm">Notifications</span>
          </ListActionItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ListActionItem>
            <SignOut color="#FF5353" />
            <span className="text-sm text-[#FF5353]">Logout</span>
          </ListActionItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ListActionItemProps {
  children: React.ReactNode,
  onClick?: () => void,
}

function ListActionItem({ children, onClick }: ListActionItemProps) {
  return (
    <DropdownMenuItem
      className="w-full flex gap-4 items-center cursor-pointer rounded-[6px]"
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