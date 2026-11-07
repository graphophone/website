"use client";

import {
  addMusicToPlaylistEndpoint,
  deleteMusicEndpoint,
  likeMusicEndpoint,
  musicCommentsEndpoint,
  musicEndpoint,
} from "@/constants/api";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { FullMusicData } from "@/types/music/music";
import { FormEvent, useContext, useEffect, useState } from "react";
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
  Pencil,
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

function MusicData({ musicId }: { musicId: number }) {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const [musicData, setMusicData] = useState<FullMusicData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<MusicComment[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const toastContext = useContext(ToastContext);
  const isUploaded = musicData?.uploadStatus === "uploaded";
  const isOwner = userContext.user?.userId === musicData?.uploader.userId;

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

  const runAction = async (
    endpoint: string,
    method: "POST" | "DELETE",
    successTitle: string,
    errorTitle: string,
  ) => {
    const response = await userContext.protectedFetch(endpoint, { method });
    toastContext.show({
      title: isRequestError(response) ? errorTitle : successTitle,
      type: isRequestError(response) ? "error" : "success",
    });
    return !isRequestError(response);
  };

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    if (await runAction(deleteMusicEndpoint(musicId), "DELETE", "Music deleted", "Failed to delete music")) {
      router.push("/");
    }
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
          <div className="transition-all flex justify-center items-center
            rounded-[6px] overflow-clip w-64 h-64 grow-0 shrink-0 relative"
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

          <div className="grow min-w-0 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="min-w-0 flex-1 text-3xl font-bold break-words">
                {musicData.title}
              </h1>
              {musicData.uploadStatus !== "uploaded" && (
                <Badge className="shrink-0">{musicData.uploadStatus}</Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button className="shrink-0 cursor-pointer" variant="outline" size="icon" />}
                >
                  <DotsThree />
                  <span className="sr-only">Track actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isOwner && (
                    <DropdownMenuItem onClick={() => router.push(`/music/${musicId}/edit`)}>
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {isOwner && isUploaded && (
                    <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                      <Trash />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {isUploaded && (
                <>
                  <Button
                    className="shrink-0 cursor-pointer"
                    variant="outline"
                    onClick={() => runAction(likeMusicEndpoint(musicId), "POST", "Music liked", "Failed to like music")}
                  >
                    <Heart />
                    Like ({musicData.likeCount})
                  </Button>
                  <Button
                    className="shrink-0 cursor-pointer"
                    variant="outline"
                    onClick={() => runAction(addMusicToPlaylistEndpoint(musicId), "POST", "Added to playlist", "Failed to add to playlist")}
                  >
                    <ListPlus />
                    Add to playlist
                  </Button>
                </>
              )}
            </div>
            {musicData.description && (
              <div>
                <span className="font-semibold">Description</span>
                <p>{musicData.description}</p>
              </div>
            )}
            {isUploaded && musicData.durationSeconds !== undefined && (
              <span className="text-sm text-muted-foreground">
                Duration: {formatDuration(musicData.durationSeconds)}
              </span>
            )}
            <UserCard profile={musicData.uploader} />
          </div>
        </div>
        <section className="border-t pt-4">
          <div className="mb-3 flex items-center gap-2">
            <ChatCircle />
            <h2 className="text-xl font-semibold">Comments</h2>
          </div>
          {!isUploaded ? (
            <p className="text-sm text-muted-foreground">
              No actions can be performed until this track is uploaded.
            </p>
          ) : (
            <>
              <form className="mb-4 flex gap-2" onSubmit={handleCommentSubmit}>
                <Input
                  value={comment}
                  onChange={event => setComment(event.target.value)}
                  placeholder="Add a comment"
                  disabled={isSubmittingComment}
                  aria-label="Comment"
                />
                <Button type="submit" disabled={isSubmittingComment || !comment.trim()}>
                  Comment
                </Button>
              </form>
              <div className="flex flex-col gap-2">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No comments yet.</p>
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