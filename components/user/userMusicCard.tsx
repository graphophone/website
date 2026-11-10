"use client";

import {
  addMusicToPlaylistEndpoint,
  likeMusicEndpoint,
} from "@/constants/api";
import { PlayerContext } from "@/context/playerContext";
import { UserContext } from "@/context/userContext";
import { ToastContext } from "@/context/toastContext";
import { isRequestError } from "@/lib/error";
import type { UserMusic } from "@/types/music/userMusic";
import type { BasicProfile } from "@/types/user/profile";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import S3Image from "../s3Image";
import UserCard from "./userCard";
import MusicMenu from "../music/musicMenu";
import MusicActionsRow from "../music/musicActionsRow";

function UserMusicCard({ music, profile }: { music: UserMusic; profile: BasicProfile }) {
  const userContext = useContext(UserContext);
  const { playMusic } = useContext(PlayerContext);
  const toastContext = useContext(ToastContext);
  const router = useRouter();
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
      <div className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 md:grid-rows-[auto_1fr] md:gap-x-4">
        <div className="relative size-20 shrink-0 overflow-clip rounded-[6px] md:row-span-2 md:size-36">
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
            <MusicMenu
              musicId={musicData.id}
              isOwner={isOwner}
              isUploaded={isUploaded}
              onDeleted={() => router.refresh()}
            />
          </div>
          <UserCard profile={profile} withFollowButton={true} />
        </div>

        {isUploaded && (
          <MusicActionsRow
            className="col-span-2 md:col-span-1 md:self-end"
            durationSeconds={musicData.durationSeconds}
            isLiked={musicData.isLiked}
            playCount={musicData.playCount}
            likeCount={musicData.likeCount}
            onPlay={() =>
              void playMusic({
                ...musicData,
                uploader: profile,
                categories: [],
                createdAt: 0,
              })
            }
            onLike={handleLike}
            onAddToPlaylist={handleAddToPlaylist}
          />
        )}
      </div>
    </Card>
  );
}

export default UserMusicCard;
