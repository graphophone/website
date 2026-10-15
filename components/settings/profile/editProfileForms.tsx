"use client"

import { SettingsProfile } from "@/types/user/profile";
import EditProfileInformationForm from "./editProfileInformationForm";
import EditProfileImageForm from "./editImageForm";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { ToastContext } from "@/context/toastContext";
import { isRequestError } from "@/lib/error";
import { AssetContext } from "@/context/assetContext";
import { notifyUploadAvatarEndpoint, notifyUploadBannerEndpoint, removeAvatarEndpoint, removeBannerEndpoint, requestUploadAvatarEndpoint, requestUploadBannerEndpoint } from "@/constants/api";

interface Props {
  fullProfile: SettingsProfile,
}

function EditProfileForms({ fullProfile }: Props) {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const assetContext = useContext(AssetContext)

  const handleEditAvatar = async (selectedImage: File | null) => {
    const uploadError = await assetContext.uploadImage({
      requestUploadEndpoint: requestUploadAvatarEndpoint,
      notifyUploadEndpoint: notifyUploadAvatarEndpoint,
      removeEndpoint: removeAvatarEndpoint,
    }, selectedImage ?? null);

    if (uploadError === "remove_fail") {
      toastContext.show({
        title: "Failed to remove avatar",
        type: "error",
      });
    } else if (uploadError === "request_upload_fail") {
      toastContext.show({
        title: "Failed to request upload avatar",
        type: "error",
      });
    } else if (uploadError === "upload_fail") {
      toastContext.show({
        title: "Failed to upload avatar",
        type: "error",
      });
    } else if (uploadError === "notify_upload_fail") {
      toastContext.show({
        title: "Failed to notify upload avatar",
        type: "error",
      });
    } else {
      toastContext.show({
        title: "Avatar uploaded",
        type: "success",
      });
    }
  };

  const handleEditBanner = async (selectedImage: File | null) => {
    const uploadError = await assetContext.uploadImage({
      requestUploadEndpoint: requestUploadBannerEndpoint,
      notifyUploadEndpoint: notifyUploadBannerEndpoint,
      removeEndpoint: removeBannerEndpoint,
    }, selectedImage ?? null);

    if (uploadError === "remove_fail") {
      toastContext.show({
        title: "Failed to remove banner",
        type: "error",
      });
    } else if (uploadError === "request_upload_fail") {
      toastContext.show({
        title: "Failed to request upload banner",
        type: "error",
      });
    } else if (uploadError === "upload_fail") {
      toastContext.show({
        title: "Failed to upload banner",
        type: "error",
      });
    } else if (uploadError === "notify_upload_fail") {
      toastContext.show({
        title: "Failed to notify upload banner",
        type: "error",
      });
    } else {
      toastContext.show({
        title: "Banner uploaded",
        type: "success",
      });
    }
  };


  return (
    <div className="w-full flex flex-col gap-4.5">
      <div className="w-full grid grid-cols-12 gap-4.5">
        <div className="col-span-5">
          <EditProfileImageForm
            title="Avatar"
            imageSemantics="avatar"
            imageUrl={fullProfile.avatarUrl}
            handleSave={handleEditAvatar}
          />
        </div>

        <div className="col-span-7">
          <EditProfileImageForm
            title="Banner"
            imageSemantics="banner"
            imageUrl={fullProfile.bannerUrl}
            handleSave={handleEditBanner}
            imageFill={true}
          />
        </div>
      </div>

      <EditProfileInformationForm fullProfile={fullProfile} />
    </div>
  )
}

export default EditProfileForms