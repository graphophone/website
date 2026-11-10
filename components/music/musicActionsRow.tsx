"use client";

import { cn, formatCompactCount } from "@/lib/utils";
import { Heart, ListPlus, Play, PlayCircle } from "phosphor-react";
import { Button } from "../ui/button";

const formatDuration = (durationSeconds: number) => {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

interface Props {
  durationSeconds?: number;
  isLiked: boolean;
  playCount: number;
  likeCount: number;
  onPlay: () => void;
  onLike: () => void;
  onAddToPlaylist: () => void;
  className?: string;
}

function MusicActionsRow({
  durationSeconds,
  isLiked,
  playCount,
  likeCount,
  onPlay,
  onLike,
  onAddToPlaylist,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-foreground", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer text-foreground"
          onClick={onPlay}
          aria-label="Play"
        >
          <Play />
        </Button>
        <span>{formatDuration(durationSeconds ?? 0)}</span>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Button
          className="shrink-0 cursor-pointer text-foreground"
          variant="outline"
          onClick={onLike}
          aria-label={isLiked ? "Liked" : "Like"}
        >
          <Heart
            className={isLiked ? "fill-red-500 text-red-500" : undefined}
            weight={isLiked ? "fill" : "regular"}
          />
          <span className="hidden md:inline">{isLiked ? "Liked" : "Like"}</span>
        </Button>
        <Button
          className="shrink-0 cursor-pointer text-foreground"
          variant="outline"
          onClick={onAddToPlaylist}
          aria-label="Add to playlist"
        >
          <ListPlus />
          <span className="hidden md:inline">Add to playlist</span>
        </Button>
        <span className="flex items-center gap-1"><PlayCircle />{formatCompactCount(playCount)}</span>
        <span className="flex items-center gap-1"><Heart />{formatCompactCount(likeCount)}</span>
      </div>
    </div>
  );
}

export default MusicActionsRow;
