"use client";

import { musicEndpoint } from "@/constants/api";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { FullMusicData } from "@/types/music/music";
import { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ToastContext } from "@/context/toastContext";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import UserCard from "../user/userCard";
import S3Image from "../s3Image";
import Image from "next/image";
import { Badge } from "../ui/badge";

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
  }, [musicId]);

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

          <div className="grow-0 min-w-0 flex flex-col gap-2">
            <h1 className="text-3xl font-bold">{musicData.title}</h1>
            {musicData.description ?
              <div>
                {musicData.description}
              </div> : <></>
            }
            {musicData.uploadStatus === "uploaded" && musicData.durationSeconds ?
              <span>{musicData.durationSeconds}</span> :
              <Badge>{musicData.uploadStatus}</Badge>
            }
            <UserCard profile={musicData.uploader} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MusicData