"use client"

import { FullProfile } from "@/types/user/profile";
import EditProfileInformationForm from "./editProfileInformationForm";

interface Params {
  fullProfile: FullProfile,
}

function EditProfileForms({ fullProfile }: Params) {
  return (
    <div className="w-full flex flex-col gap-4.5">
      <EditProfileInformationForm fullProfile={fullProfile} />
    </div>
  )
}

export default EditProfileForms