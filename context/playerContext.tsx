"use client";

import type Hls from "hls.js";
import { FullMusicData } from "@/types/music/music";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { ToastContext } from "./toastContext";
import { requestMusicPlayEndpoint } from "@/constants/api";
import { isRequestError } from "@/lib/error";

export interface IPlayerContext {
  currentMusic: FullMusicData | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playMusic: (music: FullMusicData) => Promise<void>;
  pauseMusic: () => void;
  resumeMusic: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  playNextMusic: () => void;
  playPreviousMusic: () => void;
}

export const PlayerContext = createContext<IPlayerContext>({
  currentMusic: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playMusic: () => {
    throw new Error("Function not implemented.");
  },
  pauseMusic: () => {
    throw new Error("Function not implemented.");
  },
  resumeMusic: () => {
    throw new Error("Function not implemented.");
  },
  togglePlay: () => {
    throw new Error("Function not implemented.");
  },
  seek: () => {
    throw new Error("Function not implemented.");
  },
  playNextMusic: () => {
    throw new Error("Function not implemented.");
  },
  playPreviousMusic: () => {
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
  const hlsRef = useRef<Hls | null>(null);
  const loadIdRef = useRef(0);
  const [currentMusic, setCurrentMusic] = useState<FullMusicData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const destroyHls = () => {
    hlsRef.current?.destroy();
    hlsRef.current = null;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const loadIds = loadIdRef;
    const hlsInstance = hlsRef;
    if (!audio) {
      return;
    }

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      loadIds.current++;
      hlsInstance.current?.destroy();
      hlsInstance.current = null;
    };
  }, []);

  const playMusic = async (music: FullMusicData) => {
    const loadId = ++loadIdRef.current;
    const isStale = () => loadId !== loadIdRef.current;

    destroyHls();
    setCurrentTime(0);
    setDuration(music.durationSeconds ?? 0);

    const audioElement = audioRef.current;
    if (!audioElement) {
      return;
    }

    const { default: Hls } = await import("hls.js");
    if (isStale()) {
      return;
    }

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
    if (isStale()) {
      return;
    }

    if (isRequestError(res)) {
      toastContext.show({
        title: "Failed to request music play",
        type: "error",
      });
      return;
    }

    const hlsId: string = await res.json();
    if (isStale()) {
      return;
    }

    const hls = new Hls({
      startLevel: -1,
      abrEwmaDefaultEstimate: 160_000,
      maxBufferLength: 20,
      maxMaxBufferLength: 20,
      maxBufferSize: 0,
      backBufferLength: 30,
    });
    hlsRef.current = hls;

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      audioElement.play().catch((err) => {
        console.error("play() rejected:", err);
      });
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (!data.fatal) {
        return;
      }

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      } else {
        console.error({ errorData: data });
        toastContext.show({ title: "Playback failed", type: "error" });
        destroyHls();
      }
    });

    hls.attachMedia(audioElement);
    hls.loadSource(`${process.env.NEXT_PUBLIC_EXTERNAL_ASSETS_URL}/${hlsId}`);

    setCurrentMusic({ ...music });
  };

  const pauseMusic = () => {
    audioRef.current?.pause();
  };

  const resumeMusic = () => {
    if (!hlsRef.current) {
      return;
    }

    audioRef.current?.play().catch((err) => {
      console.error("play() rejected:", err);
    });
  };

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      resumeMusic();
    } else {
      pauseMusic();
    }
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !hlsRef.current) {
      return;
    }

    const target = Math.min(Math.max(seconds, 0), duration);
    audio.currentTime = target;
    setCurrentTime(target);
  };

  const playNextMusic = () => {};

  const playPreviousMusic = () => {};

  return (
    <PlayerContext.Provider
      value={{
        currentMusic,
        isPlaying,
        currentTime,
        duration,
        playMusic,
        pauseMusic,
        resumeMusic,
        togglePlay,
        seek,
        playNextMusic,
        playPreviousMusic,
      }}
    >
      {children}

      <audio ref={audioRef} id="audio-player" className="hidden" />
    </PlayerContext.Provider>
  );
}
