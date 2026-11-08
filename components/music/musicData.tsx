"use client";

import {
  addMusicToPlaylistEndpoint,
  deleteMusicEndpoint,
  likeMusicEndpoint,
  musicCommentsEndpoint,
  musicEndpoint,
} from "@/constants/api";
import { PlayerContext } from "@/context/playerContext";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { formatCompactCount } from "@/lib/utils";
import { FullMusicData } from "@/types/music/music";
import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { ToastContext } from "@/context/toastContext";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import UserCard from "../user/userCard";
import S3Image from "../s3Image";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  ChatCircle,
  DotsThree,
  Heart,
  ListPlus,
  PlayCircle,
  Play,
  Pencil,
  SkipBack,
  SkipForward,
  Trash,
} from "phosphor-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

interface MusicComment {
  id: number;
  content: string;
  author?: {
    displayName?: string;
    username?: string;
  };
}

const formatDuration = (durationSeconds: number) => {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatCreatedAt = (createdAt: number) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(createdAt * 1000));

function MusicData({ musicId }: { musicId: number }) {
  const userContext = useContext(UserContext);
  const { playMusic } = useContext(PlayerContext);
  const router = useRouter();
  const [musicData, setMusicData] = useState<FullMusicData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<MusicComment[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const toastContext = useContext(ToastContext);
  const isUploaded = musicData?.uploadStatus === "uploaded";
  const isOwner = userContext.user?.userId === musicData?.uploader.userId;
  const description = musicData?.description ?? "";
  const hasLongDescription = description.length > 64;
  const visibleDescription = isDescriptionExpanded || !hasLongDescription
    ? description
    : `${description.slice(0, 64).trimEnd()}...`;

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await userContext.protectedFetch(musicEndpoint(musicId), {
        method: "GET",
      });

      if (isRequestError(res)) {
        toastContext.show({
          title: "Music not found",
          description: "Try again later",
          type: "error",
        });
        setIsLoading(false);
        router.push("/");
        return;
      }

      const data: FullMusicData = await res.json();
      setMusicData(data);
      setIsLoading(false);
    })();
  }, [musicId, router, toastContext, userContext]);

  useEffect(() => {
    if (!isUploaded) {
      return;
    }

    (async () => {
      const response = await userContext.protectedFetch(musicCommentsEndpoint(musicId), {
        method: "GET",
      });

      if (isRequestError(response)) {
        toastContext.show({
          title: "Failed to load comments",
          description: "Try again later",
          type: "error",
        });
        return;
      }

      const data = await response.json();
      setComments(Array.isArray(data) ? data : data.comments ?? []);
    })();
  }, [isUploaded, musicId, toastContext, userContext]);

  const handleCommentSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = comment.trim();
    if (!content || isSubmittingComment) {
      return;
    }

    setIsSubmittingComment(true);
    const response = await userContext.protectedFetch(musicCommentsEndpoint(musicId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (isRequestError(response)) {
      toastContext.show({
        title: "Failed to add comment",
        description: "Try again later",
        type: "error",
      });
    } else {
      const newComment = await response.json();
      setComments(currentComments => [...currentComments, newComment]);
      setComment("");
    }
    setIsSubmittingComment(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this track?")) {
      return;
    }
    const response = await userContext.protectedFetch(deleteMusicEndpoint(musicId), {
      method: "DELETE",
    });
    toastContext.show({
      title: isRequestError(response) ? "Failed to delete music" : "Music deleted",
      type: isRequestError(response) ? "error" : "success",
    });
    if (!isRequestError(response)) {
      router.push("/");
    }
  };

  const handleLike = async () => {
    const response = await userContext.protectedFetch(likeMusicEndpoint(musicId), {
      method: "PATCH",
    });
    if (isRequestError(response)) {
      toastContext.show({
        title: "Failed to like music",
        type: "error",
      });
      return;
    }

    setMusicData(currentMusicData => {
      if (!currentMusicData) {
        return currentMusicData;
      }

      const isLiked = !currentMusicData.isLiked;
      return {
        ...currentMusicData,
        isLiked,
        likeCount: currentMusicData.likeCount + (isLiked ? 1 : -1),
      };
    });
  };

  const handleAddToPlaylist = async () => {
    const response = await userContext.protectedFetch(addMusicToPlaylistEndpoint(musicId), {
      method: "POST",
    });
    toastContext.show({
      title: isRequestError(response) ? "Failed to add to playlist" : "Added to playlist",
      type: isRequestError(response) ? "error" : "success",
    });
  };

  if (isLoading || musicData === null) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner className="size-32" />
      </div>
    );
  }

  return (
    <Card className="w-full grow">
      <CardContent className="w-full h-full flex flex-col gap-4.5">
        <div className="w-full flex gap-4.5">
          <div className="w-48 shrink-0">
            <div className="transition-all flex justify-center items-center
              rounded-[6px] overflow-clip w-48 h-48 relative"
            >
              {musicData.thumbnailUrl ?
                <S3Image
                  src={musicData.thumbnailUrl}
                  alt="music thumbnail"
                  style={{ objectFit: "cover" }}
                  fill={true}
                /> :
                <Image
                  src="/images/empty_avatar.jpg"
                  fill={true}
                  alt="empty music thumbnail"
                />
              }
            </div>
          </div>

          <div className="h-48 grow min-w-0 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="min-w-0 flex-1 truncate text-3xl font-bold" title={musicData.title}>
                {musicData.title}
              </h1>
              {musicData.uploadStatus !== "uploaded" && (
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
                    <DropdownMenuItem onClick={() => router.push(`/music/${musicId}/edit`)}>
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
            <div className="flex items-center gap-2 text-sm text-foreground">
              <span className="font-semibold">Categories:</span>
              {musicData.categories.length > 0 ? musicData.categories.map(category => (
                <Badge key={category.id} variant="outline" className="text-foreground">
                  {category.name}
                </Badge>
              )) : (
                <span>No categories</span>
              )}
            </div>
            <span className="text-sm text-foreground">
              Created: {formatCreatedAt(musicData.createdAt)}
            </span>
            {isUploaded && (
              <div className="mt-auto flex items-center gap-2">
                <Button variant="outline" size="icon" className="text-foreground" disabled>
                  <SkipBack />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-foreground"
                  onClick={() => void playMusic(musicData)}
                >
                  <Play />
                </Button>
                <Button variant="outline" size="icon" className="text-foreground" disabled>
                  <SkipForward />
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
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <UserCard profile={musicData.uploader} />
          <div className="flex shrink-0 items-center gap-3 text-sm text-foreground">
            {isUploaded && (
              <>
                <div className="flex items-center gap-2">
                  <Button
                    className="shrink-0 cursor-pointer text-foreground"
                    variant="outline"
                    onClick={handleLike}
                  >
                    <Heart
                      className={musicData.isLiked ? "fill-red-500 text-red-500" : undefined}
                      weight={musicData.isLiked ? "fill" : "regular"}
                    />
                    {musicData.isLiked ? "Liked" : "Like"}
                  </Button>
                  <Button
                    className="shrink-0 cursor-pointer text-foreground"
                    variant="outline"
                    onClick={handleAddToPlaylist}
                  >
                    <ListPlus />
                    Add to playlist
                  </Button>
                </div>
                <span className="flex items-center gap-1">
                  <PlayCircle />
                  {formatCompactCount(musicData.playCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart />
                  {formatCompactCount(musicData.likeCount)}
                </span>
              </>
            )}
          </div>
        </div>
        {description && (
          <div className="min-w-0 text-sm text-foreground [overflow-wrap:anywhere] whitespace-pre-wrap">
            <span className="font-semibold">Description: </span>
            <span className="break-words">{visibleDescription}</span>
            {hasLongDescription && (
              <Button
                className="ml-1 h-auto p-0 text-foreground"
                variant="link"
                onClick={() => setIsDescriptionExpanded(expanded => !expanded)}
              >
                {isDescriptionExpanded ? "Show less" : "Show more"}
              </Button>
            )}
          </div>
        )}
        <section className="border-t pt-4">
          <div className="mb-3 flex items-center gap-2">
            <ChatCircle />
            <h2 className="text-xl font-semibold">Comments</h2>
          </div>
          {!isUploaded ? (
            <p className="text-sm text-foreground">
              No actions can be performed until this track is uploaded.
            </p>
          ) : (
            <>
              <form className="mb-4 flex gap-2" onSubmit={handleCommentSubmit}>
                <Input
                  value={comment}
                  onChange={event => setComment(event.target.value)}
                  placeholder="Add a comment"
                  className="text-foreground placeholder:text-foreground/60"
                  disabled={isSubmittingComment}
                />
                <Button type="submit" disabled={isSubmittingComment || !comment.trim()}>
                  Comment
                </Button>
              </form>
              <div className="flex flex-col gap-2">
                {comments.length === 0 ? (
                  <p className="text-sm text-foreground">No comments yet.</p>
                ) : comments.map(item => (
                  <div className="rounded-md border p-2" key={item.id}>
                    {item.author && (
                      <p className="text-xs font-semibold">
                        {item.author.displayName ?? item.author.username ?? "User"}
                      </p>
                    )}
                    <p className="text-sm">{item.content}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </CardContent>
    </Card>
  )
}

export default MusicData