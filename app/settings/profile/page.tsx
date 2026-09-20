"use client"

import EditProfileForms from "@/components/settings/profile/editProfileForms";
import { Spinner } from "@/components/ui/spinner";
import { myFullProfileEndpoint } from "@/constants/api";
import { ToastContext } from "@/context/toastContext";
import { UserContext } from "@/context/userContext"
import { FullProfile } from "@/types/user/profile";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react"

function ProfileSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [fullProfile, setFullProfile] = useState<FullProfile | null>(null);
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    setFullProfile(null);
    (async () => {
      const res = await userContext.protectedFetch(myFullProfileEndpoint, {
        method: "GET",
      });
    
      if (res.status !== 200) {
        toastContext.show({
          title: "Failed to get profile data",
          description: "Try again later",
          type: "error",
        });
        router.push(`/user/${userContext.user?.userId}`);
      }

      const profileData: FullProfile = await res.json();
      setFullProfile(profileData);

      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <Spinner className="size-8" />;
  }

  if (!fullProfile) {
    return <></>;
  }

  return (
    <div className="w-full min-h-full">
      <EditProfileForms fullProfile={fullProfile} />
    </div>
  )
}

export default ProfileSettingsPage