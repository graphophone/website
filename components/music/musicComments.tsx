"use client";

import { addCommentEndpoint, musicCommentsEndpoint } from "@/constants/api";
import { ToastContext } from "@/context/toastContext";
import { UserContext, type IUserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { formatCreatedAt } from "@/lib/utils";
import type { CommentsPage, MusicComment } from "@/types/comment/comment";
import React, { useContext, useEffect, useRef, useState } from "react";
import UserChip from "../user/userChip";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

const commentsTexts = {
  loadError: "Unable to load comments.",
  loadMoreError: "Unable to load more comments.",
  empty: "No comments yet.",
  userError: "Failed to get user",
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
  return await response.json() as CommentsPage;
}

function withoutDuplicates(currentComments: MusicComment[], newComments: MusicComment[]) {
  const currentIds = new Set(currentComments.map(item => item.commentId));
  return newComments.filter(item => !currentIds.has(item.commentId));
}

function MusicComments({ musicId }: { musicId: number }) {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const [comments, setComments] = useState<MusicComment[]>([]);
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

    const newComment: MusicComment = await response.json();
    setComment("");
    try {
      const data = await fetchCommentsPage(userContext, musicId, 1);
      setComments([newComment, ...withoutDuplicates([newComment], data.comments)]);
      setTotalPages(data.totalPages);
      setPageNumber(1);
      setError(null);
    } catch {
      setComments(currentComments => [newComment, ...withoutDuplicates([newComment], currentComments)]);
    }
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
        <div className="flex flex-col gap-2">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {comments.length === 0 && !error ? (
            <p className="text-sm text-foreground">{commentsTexts.empty}</p>
          ) : (
            <>
              {comments.map(item => (
                <div className="flex flex-col gap-2 rounded-md border p-2" key={item.commentId}>
                  <div className="flex items-center justify-between gap-2">
                    {item.profile ?
                      <UserChip profile={item.profile} /> :
                      <span className="text-sm text-foreground/50">{commentsTexts.userError}</span>
                    }
                    <span className="text-xs text-foreground/70">
                      {formatCreatedAt(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm [overflow-wrap:anywhere] whitespace-pre-wrap">{item.content}</p>
                </div>
              ))}
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
