"use client";

import { userMusicEndpoint } from "@/constants/api";
import { UserContext, type IUserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import type { UserMusic, UserMusicPage } from "@/types/music/userMusic";
import type { BasicProfile } from "@/types/user/profile";
import { useContext, useEffect, useRef, useState } from "react";
import UserMusicCard from "./userMusicCard";
import { Card } from "../ui/card";
import { Spinner } from "../ui/spinner";

async function fetchUserMusicPage(
  userContext: IUserContext,
  userId: number,
  pageNumber: number,
) {
  const response = await userContext.protectedFetch(userMusicEndpoint(userId, pageNumber), {
    method: "GET",
  });
  if (isRequestError(response)) {
    throw new Error("Unable to load this user's music.");
  }
  return await response.json() as UserMusicPage;
}

function UserMusic({ profile }: { profile: BasicProfile }) {
  const userContext = useContext(UserContext);
  const [music, setMusic] = useState<UserMusic[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endOfListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUserMusicPage(userContext, profile.userId, 1);
        setMusic(data.musicEntries);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unable to load this user's music.");
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
          const data = await fetchUserMusicPage(userContext, profile.userId, pageNumber + 1);
          setMusic(currentMusic => [...currentMusic, ...data.musicEntries]);
          setTotalPages(data.totalPages);
          setPageNumber(currentPage => currentPage + 1);
          setError(null);
        } catch (error) {
          setError(error instanceof Error ? error.message : "Unable to load more music.");
        } finally {
          setIsLoadingNextPage(false);
        }
      })();
    });
    observer.observe(endOfList);
    return () => observer.disconnect();
  }, [isLoading, isLoadingNextPage, pageNumber, totalPages, userContext, profile.userId]);

  if (isLoading) {
    return <div className="flex w-full justify-center"><Spinner className="size-16" /></div>;
  }

  return (
    <Card className="flex w-full flex-col gap-4.5 px-16">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {music.length === 0 && !error ? (
        <p>{profile.username} hasn&apos;t uploaded any music yet</p>
      ) : (
        <>
          {music.map(item => <UserMusicCard key={item.id} music={item} profile={profile} />)}
          <div ref={endOfListRef} className="flex min-h-8 w-full justify-center">
            {isLoadingNextPage && <Spinner className="size-8" />}
            {!error && !isLoadingNextPage && pageNumber >= totalPages && (
              <p>that&apos;s all the music for user {profile.username}</p>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

export default UserMusic;
