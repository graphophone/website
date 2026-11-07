"use client";

import { UserContext } from "@/context/userContext";
import { PlayerContext } from "@/context/playerContext";
import { useContext } from "react";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useContext(UserContext);
  const { currentSong } = useContext(PlayerContext);

  return (
    <div
      className={`w-full grow md:px-[9vw] flex${
        user && currentSong ? " pb-10" : ""
      }`}
    >
      {children}
    </div>
  );
}

function AudioPlayer() {
  const { user } = useContext(UserContext);
  const { currentSong } = useContext(PlayerContext);

  if (!user || !currentSong) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-0 md:px-[9vw]">
      <div className="flex h-8 w-full items-center border-t bg-card px-4 shadow-sm">
        <span className="truncate font-semibold">{currentSong.title}</span>
      </div>
    </div>
  );
}

export default AudioPlayer;
