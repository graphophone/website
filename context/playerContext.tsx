"use client";

import type Hls from "hls.js";
import { FullMusicData } from "@/types/music/music";
import React, { createContext, useContext, useRef, useState } from "react";
import AudioPlayer from "@/components/player/audio-player";
import { ToastContext } from "./toastContext";
import { requestMusicPlayEndpoint } from "@/constants/api";
import { isRequestError } from "@/lib/error";

export interface IPlayerContext {
  currentMusic: FullMusicData | null;
  playMusic: (music: FullMusicData) => Promise<void>;
  pauseMusic: () => void;
}

export const PlayerContext = createContext<IPlayerContext>({
  currentMusic: null,
  playMusic: () => {
    throw new Error("Function not implemented.");
  },
  pauseMusic: () => {
    throw new Error("Function not implemented.");
  },
});

export function PlayerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const toastContext = useContext(ToastContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentMusic, setCurrentMusic] = useState<FullMusicData | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const playMusic = async (music: FullMusicData) => {
    hlsRef.current?.destroy();
    hlsRef.current = null;

    const audioElement = audioRef.current;
    if (!audioElement) {
      return;
    }

    const { default: Hls } = await import("hls.js");

    if (!Hls.isSupported()) {
      toastContext.show({
        title: "HLS is not supported",
        type: "error",
      });
      return;
    }

    const res = await fetch(requestMusicPlayEndpoint(music.id), {
      method: "PATCH",
    });

    if (isRequestError(res)) {
      toastContext.show({
        title: "Failed to request music play",
        type: "error",
      });
      return;
    }

    const hlsId: string = await res.json();
    const hlsUrl = `${process.env.NEXT_PUBLIC_EXTERNAL_ASSETS_URL}/${hlsId}`;
    console.log({ hlsId, hlsUrl });

    const hls = new Hls({
      startLevel: -1,
      abrEwmaDefaultEstimate: 160_000,
      maxBufferLength: 20,
    });

    hls.loadSource(hlsUrl);
    hls.attachMedia(audioElement);

    hls.on(Hls.Events.MANIFEST_PARSED, async (_, data) => {
      console.log('Levels:', data.levels.map(l => `${l.bitrate / 1000} kbps`));
      try {
        await audioElement.play();
      } catch (err) {
        console.error("play() rejected:", err);
      }
    });

    hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
      console.log('Now playing level', data.level);
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      console.error({ data });
      if (!data.fatal) {
        return
      };
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;
        default:
          hls.destroy();
      }
    });

    setCurrentMusic({ ...music });
  };

  const pauseMusic = () => {
    audioRef.current?.pause();
  };

  return (
    <PlayerContext.Provider value={{ currentMusic, playMusic, pauseMusic }}>
      {children}

      <audio ref={audioRef} id="audio-player" className="hidden" />
      <AudioPlayer />
    </PlayerContext.Provider>
  );
}
