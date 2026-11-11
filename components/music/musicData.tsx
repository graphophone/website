"use client";

import {
  addMusicToPlaylistEndpoint,
  likeMusicEndpoint,
  musicCommentsEndpoint,
  musicEndpoint,
} from "@/constants/api";
import { PlayerContext } from "@/context/playerContext";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
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
import { ChatCircle } from "phosphor-react";
import MusicMenu from "./musicMenu";
import MusicActionsRow from "./musicActionsRow";
import { Input } from "../ui/input";

interface MusicComment {
  id: number;
  content: string;
  author?: {
    displayName?: string;
    username?: string;
  };
}

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
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
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
        setCommentsError("Failed to load comments. Try again later.");
        return;
      }

      const data = await response.json();
      setComments(Array.isArray(data) ? data : data.comments ?? []);
      setCommentsError(null);
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
        <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] gap-3 md:grid-rows-[auto_1fr] md:gap-x-4.5 md:gap-y-2">
          <div className="relative size-24 overflow-clip rounded-[6px] md:row-span-2 md:size-48">
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

          <div className="min-w-0 flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <h1 className="min-w-0 flex-1 line-clamp-2 break-words text-xl font-bold md:text-3xl" title={musicData.title}>
                {musicData.title}
              </h1>
              {musicData.uploadStatus !== "uploaded" && (
                <Badge className="shrink-0">{musicData.uploadStatus}</Badge>
              )}
              <MusicMenu
                musicId={musicId}
                isOwner={isOwner}
                isUploaded={isUploaded}
                onDeleted={() => router.push("/")}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
              <span className="font-semibold">Categories:</span>
              {musicData.categories.length > 0 ? musicData.categories.map(category => (
                <Badge key={category.id} variant="outline" className="text-foreground">
                  {category.name}
                </Badge>
              )) : (
                <span>No categories</span>
              )}
            </div>
            <UserCard profile={musicData.uploader} withFollowButton={true} />
          </div>

          {isUploaded && (
            <MusicActionsRow
              className="col-span-2 md:col-span-1 md:self-end"
              durationSeconds={musicData.durationSeconds}
              isLiked={musicData.isLiked}
              playCount={musicData.playCount}
              likeCount={musicData.likeCount}
              onPlay={() => void playMusic(musicData)}
              onLike={handleLike}
              onAddToPlaylist={handleAddToPlaylist}
            />
          )}
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
        <span className="text-sm text-foreground">
          <span className="font-semibold">Created: </span>
          {formatCreatedAt(musicData.createdAt)}
        </span>
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
                {commentsError ? (
                  <p className="text-sm text-destructive">{commentsError}</p>
                ) : comments.length === 0 ? (
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