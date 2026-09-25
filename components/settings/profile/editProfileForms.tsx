"use client"

import { FullProfile } from "@/types/user/profile";
import EditProfileInformationForm from "./editProfileInformationForm";
import EditProfileImageForm from "./editImageForm";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { editAvatarEndpoint, editBannerEndpoint } from "@/constants/api";
import { ToastContext } from "@/context/toastContext";

interface Params {
  fullProfile: FullProfile,
}

function EditProfileForms({ fullProfile }: Params) {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);

  const handleEditAvatar = async (selectedImage: File | null) => {
    let body = null;
    if (selectedImage !== null) {
      const formData = new FormData();
      formData.append('avatar', selectedImage);
      body = formData;
    }
    const res = await userContext.protectedFetch(editAvatarEndpoint, {
      method: "PUT",
      body,
    });

    if (res.status !== 200) {
      toastContext.show({
        title: "Failed to save avatar",
        type: 'error',
      });
    } else {
      toastContext.show({
        title: "Saved avatar",
        description: "Reload the page to see the results",
        type: "success",
      });
    }
  };

  const handleEditBanner = async (selectedImage: File | null) => {
    let body = null;
    if (selectedImage !== null) {
      const formData = new FormData();
      formData.append('banner', selectedImage);
      body = formData;
    }
    const res = await userContext.protectedFetch(editBannerEndpoint, {
      method: "PUT",
      body,
    });

    if (res.status !== 200) {
      toastContext.show({
        title: "Failed to save banner",
        type: 'error',
      });
    } else {
      toastContext.show({
        title: "Saved banner",
        description: "Reload the page to see the results",
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