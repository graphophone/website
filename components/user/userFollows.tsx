"use client";

import { userFollowersEndpoint, userFollowingsEndpoint } from "@/constants/api";
import { UserContext, type IUserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import type { BasicProfile, FollowsPage, MyProfile } from "@/types/user/profile";
import { useContext, useEffect, useRef, useState } from "react";
import UserCard from "./userCard";
import { Card } from "../ui/card";
import { Spinner } from "../ui/spinner";
import Link from "next/link";

type FollowsType = "followers" | "followings";

const followsTexts = {
  followers: {
    title: "Followers of",
    error: "Unable to load this user's followers.",
    empty: (username: string) => `${username} doesn't have any followers yet`,
  },
  followings: {
    title: "Followings of",
    error: "Unable to load this user's followings.",
    empty: (username: string) => `${username} isn't following anyone yet`,
  },
};

async function fetchFollowsPage(
  userContext: IUserContext,
  type: FollowsType,
  userId: number,
  pageNumber: number,
) {
  const endpoint = type === "followers" ?
    userFollowersEndpoint(userId, pageNumber) :
    userFollowingsEndpoint(userId, pageNumber);
  const response = await userContext.protectedFetch(endpoint, {
    method: "GET",
  });
  if (isRequestError(response)) {
    throw new Error();
  }
  return await response.json() as FollowsPage;
}

function UserFollows({ profile, type }: { profile: MyProfile; type: FollowsType }) {
  const userContext = useContext(UserContext);
  const [profiles, setProfiles] = useState<BasicProfile[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endOfListRef = useRef<HTMLDivElement>(null);
  const texts = followsTexts[type];

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFollowsPage(userContext, type, profile.userId, 1);
        setProfiles(data.profiles);
        setTotalPages(data.totalPages);
        setPageNumber(1);
      } catch {
        setError(texts.error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userContext, type, profile.userId]);

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
          const data = await fetchFollowsPage(userContext, type, profile.userId, pageNumber + 1);
          setProfiles(currentProfiles => [...currentProfiles, ...data.profiles]);
          setTotalPages(data.totalPages);
          setPageNumber(currentPage => currentPage + 1);
          setError(null);
        } catch {
          setError(texts.error);
        } finally {
          setIsLoadingNextPage(false);
        }
      })();
    });
    observer.observe(endOfList);
    return () => observer.disconnect();
  }, [isLoading, isLoadingNextPage, pageNumber, totalPages, userContext, type, profile.userId]);

  return (
    <Card className="flex w-full flex-col gap-4.5 px-2 md:px-16">
      <h1 className="text-lg md:text-xl">
        {texts.title}{" "}
        <Link href={`/user/${profile.userId}`} className="font-bold hover:brightness-75">
          {profile.username}
        </Link>
      </h1>

      {isLoading ?
        <div className="flex w-full justify-center"><Spinner className="size-16" /></div> :
        <>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {profiles.length === 0 && !error ? (
            <p>{texts.empty(profile.username)}</p>
          ) : (
            <>
              {profiles.map(item => (
                <UserCard key={item.userId} profile={item} />
              ))}
              <div ref={endOfListRef} className="flex min-h-8 w-full justify-center">
                {isLoadingNextPage && <Spinner className="size-8" />}
              </div>
            </>
          )}
        </>
      }
    </Card>
  );
}

export default UserFollows;
