"use client";

import {
  addMusicToPlaylistEndpoint,
  likeMusicEndpoint,
} from "@/constants/api";
import { UserContext } from "@/context/userContext";
import { PlayerContext } from "@/context/playerContext";
import { ToastContext } from "@/context/toastContext";
import { isRequestError } from "@/lib/error";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { Heart, ListPlus, Play, SkipBack, SkipForward } from "phosphor-react";
import { Button } from "../ui/button";
import S3Image from "../s3Image";
import UserCard from "../user/userCard";
import { useHorizontalSwipe } from "@/hooks/use-horizontal-swipe";

function AudioPlayer() {
  const userContext = useContext(UserContext);
  const { currentMusic, playNextMusic, playPreviousMusic } = useContext(PlayerContext);
  const toastContext = useContext(ToastContext);
  const [likedMusic, setLikedMusic] = useState<{ id: number; isLiked: boolean } | null>(null);
  const swipeHandlers = useHorizontalSwipe({
    onSwipeLeft: playNextMusic,
    onSwipeRight: playPreviousMusic,
  });

  if (!userContext.user || !currentMusic) {
    return null;
  }

  const isLiked = likedMusic?.id === currentMusic.id ? likedMusic.isLiked : currentMusic.isLiked;

  const handleLike = async () => {
    const response = await userContext.protectedFetch(likeMusicEndpoint(currentMusic.id), {
      method: "PATCH",
    });
    if (isRequestError(response)) {
      toastContext.show({ title: "Failed to like music", type: "error" });
      return;
    }
    setLikedMusic({ id: currentMusic.id, isLiked: !isLiked });
  };

  const handleAddToPlaylist = async () => {
    const response = await userContext.protectedFetch(addMusicToPlaylistEndpoint(currentMusic.id), {
      method: "POST",
    });
    toastContext.show({
      title: isRequestError(response) ? "Failed to add to playlist" : "Added to playlist",
      type: isRequestError(response) ? "error" : "success",
    });
  };

  return (
    <div className="sticky bottom-0 z-50 md:px-[9vw]">
      <div
        className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-t bg-card p-2 shadow-sm md:grid-cols-[auto_auto_auto_auto_minmax(0,1fr)_auto] md:gap-y-2 md:p-3"
        {...swipeHandlers}
      >
        <div className="relative hidden size-20 shrink-0 overflow-clip rounded-[6px] md:col-start-1 md:row-span-2 md:row-start-1 md:block">
          {currentMusic.thumbnailUrl ? (
            <S3Image
              src={currentMusic.thumbnailUrl}
              alt="music thumbnail"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Image src="/images/empty_thumbnail.png" fill={true} alt="empty music thumbnail" />
          )}
        </div>

        <div className="col-start-2 row-start-1 flex min-w-0 items-center justify-between gap-3 md:col-span-5">
          <Link
            href={`/music/${currentMusic.id}`}
            className="truncate text-sm font-bold md:text-lg"
            title={currentMusic.title}
          >
            {currentMusic.title}
          </Link>
          <div className="hidden shrink-0 md:block">
            <UserCard profile={currentMusic.uploader} />
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="hidden cursor-pointer text-foreground md:col-start-2 md:row-start-2 md:inline-flex"
          aria-label="Previous track"
          onClick={playPreviousMusic}
        >
          <SkipBack />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="col-start-1 row-span-2 row-start-1 size-12 text-foreground md:col-start-3 md:row-span-1 md:row-start-2 md:size-8"
          aria-label="Play"
          disabled
        >
          <Play className="size-6 md:size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden cursor-pointer text-foreground md:col-start-4 md:row-start-2 md:inline-flex"
          aria-label="Next track"
          onClick={playNextMusic}
        >
          <SkipForward />
        </Button>

        <input
          className="col-start-2 row-start-2 min-w-0 accent-primary md:col-start-5"
          type="range"
          min={0}
          max={currentMusic.durationSeconds ?? 0}
          defaultValue={0}
          disabled
          aria-label="Playback progress"
        />

        <div className="col-start-3 row-span-2 row-start-1 flex items-center gap-2 md:col-start-6 md:row-span-1 md:row-start-2">
          <Button
            className="shrink-0 cursor-pointer text-foreground"
            variant="outline"
            size="icon"
            aria-label={isLiked ? "Liked" : "Like"}
            onClick={handleLike}
          >
            <Heart className={isLiked ? "fill-red-500 text-red-500" : undefined} weight={isLiked ? "fill" : "regular"} />
          </Button>
          <Button
            className="shrink-0 cursor-pointer text-foreground"
            variant="outline"
            size="icon"
            aria-label="Add to playlist"
            onClick={handleAddToPlaylist}
          >
            <ListPlus />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
