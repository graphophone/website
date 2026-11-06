"use client";

import { UserContext } from "@/context/userContext";
import { PlayerContext } from "@/context/playerContext";
import { useContext } from "react";

function AudioPlayer() {
  const { user } = useContext(UserContext);
  const { currentSong } = useContext(PlayerContext);

  if (!user || !currentSong) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-0 md:px-[9vw]">
      <div className="flex h-16 w-full items-center border-t bg-card px-4 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <span className="truncate font-semibold">{currentSong.title}</span>
      </div>
    </div>
  );
}

export default AudioPlayer;
