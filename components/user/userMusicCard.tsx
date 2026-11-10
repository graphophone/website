"use client";

import {
  addMusicToPlaylistEndpoint,
  likeMusicEndpoint,
} from "@/constants/api";
import { PlayerContext } from "@/context/playerContext";
import { UserContext } from "@/context/userContext";
import { ToastContext } from "@/context/toastContext";
import { isRequestError } from "@/lib/error";
import { formatCompactCount } from "@/lib/utils";
import type { UserMusic } from "@/types/music/userMusic";
import type { BasicProfile } from "@/types/user/profile";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { Heart, ListPlus, Play, PlayCircle } from "phosphor-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import S3Image from "../s3Image";
import UserCard from "./userCard";
import UserMusicCardMenu from "./userMusicCardMenu";

const formatDuration = (durationSeconds: number) => {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

function UserMusicCard({ music, profile }: { music: UserMusic; profile: BasicProfile }) {
  const userContext = useContext(UserContext);
  const { playMusic } = useContext(PlayerContext);
  const toastContext = useContext(ToastContext);
  const [currentTime, setCurrentTime] = useState(0);
  const [musicData, setMusicData] = useState(music);
  const isUploaded = musicData.uploadStatus === "uploaded";
  const isOwner = userContext.user?.userId === profile.userId;

  const handleLike = async () => {
    const response = await userContext.protectedFetch(likeMusicEndpoint(musicData.id), {
      method: "PATCH",
    });
    if (isRequestError(response)) {
      toastContext.show({ title: "Failed to like music", type: "error" });
      return;
    }

    setMusicData(currentMusic => {
      const isLiked = !currentMusic.isLiked;
      return {
        ...currentMusic,
        isLiked,
        likeCount: currentMusic.likeCount + (isLiked ? 1 : -1),
      };
    });
  };

  const handleAddToPlaylist = async () => {
    const response = await userContext.protectedFetch(addMusicToPlaylistEndpoint(musicData.id), {
      method: "POST",
    });
    toastContext.show({
      title: isRequestError(response) ? "Failed to add to playlist" : "Added to playlist",
      type: isRequestError(response) ? "error" : "success",
    });
  };

  return (
    <Card className="w-full p-3 md:p-4">
      <div className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 md:grid-rows-[auto_auto_auto_1fr] md:gap-x-4">
        <div className="relative size-20 shrink-0 overflow-clip rounded-[6px] md:row-span-4 md:size-36">
          {musicData.thumbnailUrl ? (
            <S3Image
              src={musicData.thumbnailUrl}
              alt="music thumbnail"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Image src="/images/empty_avatar.jpg" fill={true} alt="empty music thumbnail" />
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href={`/music/${musicData.id}`}
              className="min-w-0 flex-1 truncate text-lg font-bold md:text-xl"
              title={musicData.title}
            >
              {musicData.title}
            </Link>
            {isOwner && musicData.uploadStatus !== "uploaded" && (
              <Badge className="shrink-0">{musicData.uploadStatus}</Badge>
            )}
            <UserMusicCardMenu musicId={musicData.id} isOwner={isOwner} isUploaded={isUploaded} />
          </div>
          <UserCard profile={profile} />
        </div>

        {isUploaded && (
          <div className="col-span-2 flex min-w-0 items-center gap-2 md:col-span-1">
            <Button
              variant="outline"
              size="icon"
              className="text-foreground"
              onClick={() =>
                void playMusic({
                  ...musicData,
                  uploader: profile,
                  categories: [],
                  createdAt: 0,
                })
              }
            >
              <Play />
            </Button>
            <input
              className="min-w-0 flex-1 accent-primary"
              type="range"
              min={0}
              max={musicData.durationSeconds ?? 0}
              value={currentTime}
              onChange={event => setCurrentTime(Number(event.target.value))}
            />
            <span className="shrink-0 text-sm text-foreground">
              {formatDuration(currentTime)} / {formatDuration(musicData.durationSeconds ?? 0)}
            </span>
          </div>
        )}

        {isUploaded && (
          <div className="col-span-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-foreground md:col-span-1">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Button
                className="shrink-0 cursor-pointer text-foreground"
                variant="outline"
                onClick={handleLike}
                aria-label={musicData.isLiked ? "Liked" : "Like"}
              >
                <Heart
                  className={musicData.isLiked ? "fill-red-500 text-red-500" : undefined}
                  weight={musicData.isLiked ? "fill" : "regular"}
                />
                <span className="hidden md:inline">{musicData.isLiked ? "Liked" : "Like"}</span>
              </Button>
              <Button
                className="shrink-0 cursor-pointer text-foreground"
                variant="outline"
                onClick={handleAddToPlaylist}
                aria-label="Add to playlist"
              >
                <ListPlus />
                <span className="hidden md:inline">Add to playlist</span>
              </Button>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="flex items-center gap-1"><PlayCircle />{formatCompactCount(musicData.playCount)}</span>
              <span className="flex items-center gap-1"><Heart />{formatCompactCount(musicData.likeCount)}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default UserMusicCard;
