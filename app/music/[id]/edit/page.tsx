"use client"

import EditMusicForm from "@/components/music/editMusicForm";
import { musicEndpoint } from "@/constants/api";
import { ToastContext } from "@/context/toastContext";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { FullMusicData } from "@/types/music/music";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

function EditMusicPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const [musicData, setMusicData] = useState<FullMusicData | null>(null);

  useEffect(() => {
    if (userContext.isLoading) {
      return;
    }

    (async () => {
      const response = await userContext.protectedFetch(musicEndpoint(Number(id)), {
        method: "GET",
      });

      if (isRequestError(response)) {
        toastContext.show({
          title: "Music not found",
          description: "Try again later",
          type: "error",
        });
        router.push("/");
        return;
      }

      const data: FullMusicData = await response.json();
      if (userContext.user?.userId !== data.uploader.userId) {
        router.push(`/music/${id}`);
        return;
      }
      setMusicData(data);
    })();
  }, [id, router, toastContext, userContext]);

  if (!musicData) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner className="size-32" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <EditMusicForm musicData={musicData} />
    </div>
  );
}

export default EditMusicPage;
