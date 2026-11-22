"use client";

import { addCommentEndpoint, musicCommentsEndpoint } from "@/constants/api";
import { ToastContext } from "@/context/toastContext";
import { UserContext, type IUserContext } from "@/context/userContext";
import { withToggledLike, withoutDuplicates } from "@/lib/comment";
import { isRequestError } from "@/lib/error";
import type { MusicCommentEntry, MusicCommentsPage } from "@/types/comment/comment";
import React, { useContext, useEffect, useRef, useState } from "react";
import CommentCard from "./commentCard";
import UserChip from "../user/userChip";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

const commentsTexts = {
  loadError: "Unable to load comments.",
  loadMoreError: "Unable to load more comments.",
  empty: "No comments yet.",
};

async function fetchCommentsPage(
  userContext: IUserContext,
  musicId: number,
  pageNumber: number,
) {
  const response = await userContext.protectedFetch(musicCommentsEndpoint(musicId, pageNumber), {
    method: "GET",
  });
  if (isRequestError(response)) {
    throw new Error();
  }
  return await response.json() as MusicCommentsPage;
}

function MusicComments({ musicId }: { musicId: number }) {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const [comments, setComments] = useState<MusicCommentEntry[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const endOfListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCommentsPage(userContext, musicId, 1);
        setComments(data.comments);
        setTotalPages(data.totalPages);
        setPageNumber(1);
      } catch {
        setError(commentsTexts.loadError);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userContext, musicId]);

  useEffect(() => {
    const endOfList = endOfListRef.current;
    if (!endOfList) {
      return;
    }

    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || isLoading || isLoadingNextPage || pageNumber >= totalPages) {
        return;
      }

      (async () => {
        setIsLoadingNextPage(true);
        try {
          const data = await fetchCommentsPage(userContext, musicId, pageNumber + 1);
          setComments(currentComments => [
            ...currentComments,
            ...withoutDuplicates(currentComments, data.comments),
          ]);
          setTotalPages(data.totalPages);
          setPageNumber(currentPage => currentPage + 1);
          setError(null);
        } catch {
          setError(commentsTexts.loadMoreError);
        } finally {
          setIsLoadingNextPage(false);
        }
      })();
    });
    observer.observe(endOfList);
    return () => observer.disconnect();
  }, [isLoading, isLoadingNextPage, pageNumber, totalPages, userContext, musicId]);

  const reloadFirstPage = async () => {
    try {
      const data = await fetchCommentsPage(userContext, musicId, 1);
      setComments(data.comments);
      setTotalPages(data.totalPages);
      setPageNumber(1);
      setError(null);
    } catch {
      setError(commentsTexts.loadError);
    }
  };

  const updateComment = (commentId: number, content: string) => {
    setComments(currentComments => currentComments.map(item =>
      item.commentId === commentId ? { ...item, content } : item));
  };

  const toggleCommentLike = (commentId: number) => {
    setComments(currentComments => currentComments.map(item =>
      item.commentId === commentId ? withToggledLike(item) : item));
  };

  const removeComment = async (commentId: number) => {
    setComments(currentComments => currentComments.filter(item => item.commentId !== commentId));
    await reloadFirstPage();
  };

  const handleCommentSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = comment.trim();
    if (!content || isSubmittingComment) {
      return;
    }

    setIsSubmittingComment(true);
    const response = await userContext.protectedFetch(addCommentEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ musicId: Number(musicId), content }),
    });

    if (isRequestError(response)) {
      toastContext.show({
        title: "Failed to add comment",
        description: "Try again later",
        type: "error",
      });
      setIsSubmittingComment(false);
      return;
    }

    setComment("");
    await reloadFirstPage();
    setIsSubmittingComment(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <form className="flex gap-2" onSubmit={handleCommentSubmit}>
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

      {isLoading ?
        <div className="flex w-full justify-center"><Spinner className="size-8" /></div> :
        <div className="flex flex-col">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {comments.length === 0 && !error ? (
            <p className="text-sm text-foreground">{commentsTexts.empty}</p>
          ) : (
            <>
              <div className="flex flex-col divide-y">
                {comments.map(item => (
                  <CommentCard
                    key={item.commentId}
                    comment={item}
                    header={item.profile ?
                      <UserChip profile={item.profile} /> :
                      <span className="text-sm text-foreground/50">Failed to get user</span>
                    }
                    isOwner={item.profile !== null && userContext.user?.userId === item.profile.userId}
                    onUpdated={content => updateComment(item.commentId, content)}
                    onLikeToggled={() => toggleCommentLike(item.commentId)}
                    onDeleted={() => removeComment(item.commentId)}
                  />
                ))}
              </div>
              <div ref={endOfListRef} className="flex min-h-8 w-full justify-center">
                {isLoadingNextPage && <Spinner className="size-8" />}
              </div>
            </>
          )}
        </div>
      }
    </div>
  );
}

export default MusicComments;
