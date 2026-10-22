"use client";

import { trackEndpoint } from "@/constants/api";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { FullTrackData } from "@/types/track/track";
import { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ToastContext } from "@/context/toastContext";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import UserCard from "../user/userCard";
import S3Image from "../s3Image";
import Image from "next/image";
import { Badge } from "../ui/badge";

function TrackData({ trackId }: { trackId: number }) {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const [trackData, setTrackData] = useState<FullTrackData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await userContext.protectedFetch(trackEndpoint(trackId), {
        method: "GET",
      });

      if (isRequestError(res)) {
        toastContext.show({
          title: "Track not found",
          description: "Try again later",
          type: "error",
        });
        setIsLoading(false);
        router.push("/");
        return;
      }

      const data: FullTrackData = await res.json();
      setTrackData(data);
      setIsLoading(false);
    })();
  }, [trackId]);

  if (isLoading || trackData === null) {
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
            {trackData.thumbnailUrl ?
              <S3Image
                src={trackData.thumbnailUrl}
                alt="track thumbnail"
                style={{ objectFit: "cover" }}
                fill={true}
              /> :
              <Image
                src="/images/empty_avatar.jpg"
                fill={true}
                alt="empty track thumbnail"
              />
            }
          </div>

          <div className="grow-0 min-w-0 flex flex-col gap-2">
            <h1 className="text-3xl font-bold">{trackData.title}</h1>
            {trackData.description ?
              <div>
                {trackData.description}
              </div> : <></>
            }
            {trackData.uploadStatus === "uploaded" && trackData.durationSeconds ?
              <span>{trackData.durationSeconds}</span> :
              <Badge>{trackData.uploadStatus}</Badge>
            }
            <UserCard profile={trackData.uploader} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TrackData