"use client";

import { FullMusicData } from "@/types/music/music";
import React, { createContext, useState } from "react";

export interface IPlayerContext {
  currentSong: FullMusicData | null;
  playSong: (song: FullMusicData) => void;
  stopSong: () => void;
}

export const PlayerContext = createContext<IPlayerContext>({
  currentSong: null,
  playSong: () => {
    throw new Error("Function not implemented.");
  },
  stopSong: () => {
    throw new Error("Function not implemented.");
  },
});

export function PlayerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentSong, setCurrentSong] = useState<FullMusicData | null>({
    id: 0,
    title: "Default song",
    playCount: 0,
    likeCount: 0,
    uploader: {
      userId: 0,
      username: "Graphophone",
      avatarUrl: null,
    },
    categories: [],
    uploadStatus: "uploaded",
    createdAt: new Date(0),
  });

  const playSong = (song: FullMusicData) => {
    setCurrentSong(song);
  };

  const stopSong = () => {
    setCurrentSong(null);
  };

  return (
    <PlayerContext.Provider value={{ currentSong, playSong, stopSong }}>
      {children}
    </PlayerContext.Provider>
  );
}
