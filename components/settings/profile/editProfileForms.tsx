"use client"

import { FullProfile } from "@/types/user/profile";
import EditProfileInformationForm from "./editProfileInformationForm";
import EditAvatarForm from "./editAvatarForm";

interface Params {
  fullProfile: FullProfile,
}

function EditProfileForms({ fullProfile }: Params) {
  return (
    <div className="w-full flex flex-col gap-4.5">
      <div className="w-full grid grid-cols-12 gap-4.5">
        <div className="col-span-5">
          <EditAvatarForm avatarUrl={fullProfile.avatarUrl} />
        </div>
      </div>

      <EditProfileInformationForm fullProfile={fullProfile} />
    </div>
  )
}

export default EditProfileForms