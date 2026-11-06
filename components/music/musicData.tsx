"use client";

import { musicEndpoint } from "@/constants/api";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { FullMusicData } from "@/types/music/music";
import { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { ToastContext } from "@/context/toastContext";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import UserCard from "../user/userCard";
import S3Image from "../s3Image";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Pencil } from "phosphor-react";

function MusicData({ musicId }: { musicId: number }) {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const [musicData, setMusicData] = useState<FullMusicData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toastContext = useContext(ToastContext);

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
              {userContext.user?.userId === musicData.uploader.userId && (
                <Button
                  className="shrink-0 cursor-pointer"
                  onClick={() => router.push(`/music/${musicId}/edit`)}
                >
                  <Pencil />
                  Edit
                </Button>
              )}
            </div>
            {musicData.description && (
              <div>
                <span className="font-semibold">Description</span>
                <p>{musicData.description}</p>
              </div>
            )}
            {musicData.uploadStatus === "uploaded" && musicData.durationSeconds && (
              <span>{musicData.durationSeconds}</span>
            )}
            <UserCard profile={musicData.uploader} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MusicData