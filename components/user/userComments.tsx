"use client";

import { userCommentsEndpoint } from "@/constants/api";
import { UserContext, type IUserContext } from "@/context/userContext";
import { withToggledLike, withoutDuplicates } from "@/lib/comment";
import { isRequestError } from "@/lib/error";
import type { UserCommentEntry, UserCommentsPage } from "@/types/comment/comment";
import type { MyProfile } from "@/types/user/profile";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import CommentCard from "../music/commentCard";
import { Card } from "../ui/card";
import { Spinner } from "../ui/spinner";

const commentsTexts = {
  loadError: "Unable to load this user's comments.",
  loadMoreError: "Unable to load more comments.",
};

async function fetchUserCommentsPage(
  userContext: IUserContext,
  userId: number,
  pageNumber: number,
) {
  const response = await userContext.protectedFetch(userCommentsEndpoint(userId, pageNumber), {
    method: "GET",
  });
  if (isRequestError(response)) {
    throw new Error();
  }
  return await response.json() as UserCommentsPage;
}

function UserComments({ profile }: { profile: MyProfile }) {
  const userContext = useContext(UserContext);
  const [comments, setComments] = useState<UserCommentEntry[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endOfListRef = useRef<HTMLDivElement>(null);
  const isOwner = userContext.user?.userId === profile.userId;

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUserCommentsPage(userContext, profile.userId, 1);
        setComments(data.comments);
        setTotalPages(data.totalPages);
        setPageNumber(1);
      } catch {
        setError(commentsTexts.loadError);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userContext, profile.userId]);

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
          const data = await fetchUserCommentsPage(userContext, profile.userId, pageNumber + 1);
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
  }, [isLoading, isLoadingNextPage, pageNumber, totalPages, userContext, profile.userId]);

  const reloadFirstPage = async () => {
    try {
      const data = await fetchUserCommentsPage(userContext, profile.userId, 1);
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

  if (isLoading) {
    return <div className="flex w-full justify-center"><Spinner className="size-16" /></div>;
  }

  return (
    <Card className="flex w-full flex-col gap-2 px-2 md:px-16">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {comments.length === 0 && !error ? (
        <p>{profile.username} hasn&apos;t left any comments yet</p>
      ) : (
        <>
          {comments.map(item => (
            <CommentCard
              key={item.commentId}
              comment={item}
              header={item.music ?
                <Link
                  href={`/music/${item.music.id}`}
                  className="min-w-0 truncate font-bold hover:brightness-75"
                  title={item.music.title}
                >
                  {item.music.title}
                </Link> :
                <span className="text-sm text-foreground/50">Failed to get music</span>
              }
              isOwner={isOwner}
              onUpdated={content => updateComment(item.commentId, content)}
              onLikeToggled={() => toggleCommentLike(item.commentId)}
              onDeleted={() => removeComment(item.commentId)}
            />
          ))}
          <div ref={endOfListRef} className="flex min-h-8 w-full justify-center">
            {isLoadingNextPage && <Spinner className="size-8" />}
          </div>
        </>
      )}
    </Card>
  );
}

export default UserComments;
