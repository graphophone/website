"use client"

import { EditProfileForm, editProfileSchema } from "@/types/settings/forms";
import { FullProfile } from "@/types/user/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import EditProfileInformationForm from "./editProfileInformationForm";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/userContext";
import { editProfileEndpoint } from "@/constants/api";
import { ToastContext, ToastDefaultMessage } from "@/context/toastContext";

interface Params {
  fullProfile: FullProfile,
}

function EditProfileForms({ fullProfile }: Params) {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);

  const editProfileFormDefaultValues: EditProfileForm = {
    username: fullProfile.username,
    email: fullProfile.email,
    firstName: fullProfile.firstName ?? '',
    lastName: fullProfile.lastName ?? '',
    bio: fullProfile.bio ?? '',
    country: fullProfile.country ?? '',
    city: fullProfile.city ?? '',
  };
  const editProfileForm = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { ...editProfileFormDefaultValues },
  });
  const resetEditProfileForm = () => {
    editProfileForm.setValues({ ...editProfileFormDefaultValues });
  }

  const handleEditProfile = async () => {
    const res = await userContext.protectedFetch(editProfileEndpoint, {
      method: "PUT",
      body: JSON.stringify(editProfileForm.getValues()),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 409) {
      throw {
        title: "Credentials are already used",
        description: "Try using another username or email",
      } as ToastDefaultMessage;
    }
    if (res.status !== 200) {
      throw {
        title: "Failed to save profile information",
        description: "Unknown error",
      } as ToastDefaultMessage;
    }
    return {
      title: "Successfully saved profile information",
    } as ToastDefaultMessage;
  }

  const handleSave = async () => {
    const results = await Promise.allSettled([
      handleEditProfile(),
    ]);

    for (const result of results) {
      if (result.status === "rejected") {
        const message: ToastDefaultMessage= result.reason;
        toastContext.show({ ...message, type: "error" });
      } else {
        const message: ToastDefaultMessage = result.value;
        toastContext.show({ ...message, type: "success" });
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4.5">
      <EditProfileInformationForm
        editProfileForm={editProfileForm}
        resetEditProfileForm={resetEditProfileForm}
      />

      <div className="w-full">
        <Button
          className="cursor-pointer"
          disabled={!editProfileForm.formState.isValid}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default EditProfileForms