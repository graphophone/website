"use client";

import {
  addMusicToPlaylistEndpoint,
  deleteMusicEndpoint,
  likeMusicEndpoint,
} from "@/constants/api";
import { UserContext } from "@/context/userContext";
import { ToastContext } from "@/context/toastContext";
import { isRequestError } from "@/lib/error";
import { formatCompactCount } from "@/lib/utils";
import type { UserMusic } from "@/types/music/userMusic";
import type { BasicProfile } from "@/types/user/profile";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DotsThree,
  Heart,
  ListPlus,
  Pencil,
  Play,
  PlayCircle,
  SkipBack,
  SkipForward,
  Trash,
} from "phosphor-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import S3Image from "../s3Image";
import UserCard from "./userCard";

const formatDuration = (durationSeconds: number) => {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

function UserMusicCard({ music, profile }: { music: UserMusic; profile: BasicProfile }) {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const router = useRouter();
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

  const handleDelete = async () => {
    if (!window.confirm("Delete this track?")) {
      return;
    }

    const response = await userContext.protectedFetch(deleteMusicEndpoint(musicData.id), {
      method: "DELETE",
    });
    toastContext.show({
      title: isRequestError(response) ? "Failed to delete music" : "Music deleted",
      type: isRequestError(response) ? "error" : "success",
    });
    if (!isRequestError(response)) {
      router.refresh();
    }
  };

  return (
    <Card className="w-full p-4">
      <div className="flex w-full min-w-0 gap-4">
        <div className="relative h-36 w-36 shrink-0 overflow-clip rounded-[6px]">
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

        <div className="flex min-w-0 grow flex-col gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href={`/music/${musicData.id}`}
              className="min-w-0 flex-1 truncate text-xl font-bold"
              title={musicData.title}
            >
              {musicData.title}
            </Link>
            {isOwner && musicData.uploadStatus !== "uploaded" && (
              <Badge className="shrink-0">{musicData.uploadStatus}</Badge>
            )}
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button className="shrink-0 cursor-pointer text-foreground" variant="outline" size="icon" />}
                >
                  <DotsThree />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/music/${musicData.id}/edit`)}>
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                  {isUploaded && (
                    <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                      <Trash />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <UserCard profile={profile} />
          {isUploaded && (
            <div className="flex min-w-0 items-center gap-2">
              <Button variant="outline" size="icon" className="text-foreground" disabled><SkipBack /></Button>
              <Button variant="outline" size="icon" className="text-foreground" disabled><Play /></Button>
              <Button variant="outline" size="icon" className="text-foreground" disabled><SkipForward /></Button>
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
            <div className="flex items-center justify-between gap-4 text-sm text-foreground">
              <div className="flex flex-wrap items-center gap-3">
                <Button className="shrink-0 cursor-pointer text-foreground" variant="outline" onClick={handleLike}>
                  <Heart
                    className={musicData.isLiked ? "fill-red-500 text-red-500" : undefined}
                    weight={musicData.isLiked ? "fill" : "regular"}
                  />
                  {musicData.isLiked ? "Liked" : "Like"}
                </Button>
                <Button className="shrink-0 cursor-pointer text-foreground" variant="outline" onClick={handleAddToPlaylist}>
                  <ListPlus />
                  Add to playlist
                </Button>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="flex items-center gap-1"><PlayCircle />{formatCompactCount(musicData.playCount)}</span>
                <span className="flex items-center gap-1"><Heart />{formatCompactCount(musicData.likeCount)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default UserMusicCard;
