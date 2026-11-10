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

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useContext(UserContext);
  const { currentMusic } = useContext(PlayerContext);

  return (
    <div
      className={`w-full grow md:px-[9vw] flex ${
        user && currentMusic ? "pb-10" : "pb-4.5"
      }`}
    >
      {children}
    </div>
  );
}

function AudioPlayer() {
  const userContext = useContext(UserContext);
  const { currentMusic } = useContext(PlayerContext);
  const toastContext = useContext(ToastContext);
  const [likedMusic, setLikedMusic] = useState<{ id: number; isLiked: boolean } | null>(null);

  if (!userContext.user || !currentMusic) {
    return null;
  }

  const isLiked = likedMusic?.id === currentMusic.id ? likedMusic.isLiked : currentMusic.isLiked;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-0 md:px-[9vw]">
      <div className="flex w-full min-w-0 gap-4 border-t bg-card p-3 shadow-sm">
        <div className="relative h-20 w-20 shrink-0 overflow-clip rounded-[6px]">
          {currentMusic.thumbnailUrl ? (
            <S3Image
              src={currentMusic.thumbnailUrl}
              alt="music thumbnail"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Image src="/images/empty_avatar.jpg" fill={true} alt="empty music thumbnail" />
          )}
        </div>

        <div className="flex min-w-0 grow flex-col gap-2">
          <Link
            href={`/music/${currentMusic.id}`}
            className="truncate text-lg font-bold"
            title={currentMusic.title}
          >
            {currentMusic.title}
          </Link>

          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <UserCard profile={currentMusic.uploader} />
            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="shrink-0 cursor-pointer text-foreground"
                variant="outline"
                onClick={async () => {
                  const response = await userContext.protectedFetch(likeMusicEndpoint(currentMusic.id), {
                    method: "PATCH",
                  });
                  if (isRequestError(response)) {
                    toastContext.show({ title: "Failed to like music", type: "error" });
                    return;
                  }
                  setLikedMusic({ id: currentMusic.id, isLiked: !isLiked });
                }}
              >
                <Heart className={isLiked ? "fill-red-500 text-red-500" : undefined} weight={isLiked ? "fill" : "regular"} />
                {isLiked ? "Liked" : "Like"}
              </Button>
              <Button
                className="shrink-0 cursor-pointer text-foreground"
                variant="outline"
                onClick={async () => {
                  const response = await userContext.protectedFetch(addMusicToPlaylistEndpoint(currentMusic.id), {
                    method: "POST",
                  });
                  toastContext.show({
                    title: isRequestError(response) ? "Failed to add to playlist" : "Added to playlist",
                    type: isRequestError(response) ? "error" : "success",
                  });
                }}
              >
                <ListPlus />
                Add to playlist
              </Button>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <Button variant="outline" size="icon" className="text-foreground" disabled><SkipBack /></Button>
            <Button variant="outline" size="icon" className="text-foreground" disabled><Play /></Button>
            <Button variant="outline" size="icon" className="text-foreground" disabled><SkipForward /></Button>
            <input
              className="min-w-0 flex-1 accent-primary"
              type="range"
              min={0}
              max={currentMusic.durationSeconds ?? 0}
              defaultValue={0}
              disabled
              aria-label="Playback progress"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
