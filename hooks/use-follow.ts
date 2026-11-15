import { followUserEndpoint } from "@/constants/api";
import { ToastContext } from "@/context/toastContext";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { BasicProfile } from "@/types/user/profile";
import { useContext, useState } from "react";

export function useFollow(profile: BasicProfile) {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const [followed, setFollowed] = useState<{ userId: number; isFollowed: boolean } | null>(null);
  const isFollowed = followed?.userId === profile.userId ?
    followed.isFollowed :
    profile.followsCount?.isFollowed ?? false;
  const followsCount = profile.followsCount && {
    ...profile.followsCount,
    isFollowed,
    followersCount: profile.followsCount.followersCount
      + Number(isFollowed) - Number(profile.followsCount.isFollowed),
  };
  const canFollow = userContext.user?.userId !== profile.userId;

  const toggleFollow = async () => {
    const response = await userContext.protectedFetch(followUserEndpoint(profile.userId), {
      method: "PATCH",
    });
    if (isRequestError(response)) {
      toastContext.show({
        title: "Failed to follow user",
        type: "error",
      });
      return;
    }

    setFollowed({ userId: profile.userId, isFollowed: !isFollowed });
  };

  return { followsCount, isFollowed, canFollow, toggleFollow };
}
