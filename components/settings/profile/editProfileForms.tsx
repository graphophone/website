"use client"

import { editProfileEndpoint, notifyUploadAvatarEndpoint, notifyUploadBannerEndpoint, removeAvatarEndpoint, removeBannerEndpoint, requestUploadAvatarEndpoint, requestUploadBannerEndpoint } from "@/constants/api";
import { AssetContext } from "@/context/assetContext";
import { ToastContext } from "@/context/toastContext";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { EditProfileForm, editProfileSchema } from "@/types/settings/forms";
import { SettingsProfile } from "@/types/user/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import EditProfileImageForm from "./editImageForm";
import EditProfileInformationForm from "./editProfileInformationForm";

interface Props {
  fullProfile: SettingsProfile,
}

function EditProfileForms({ fullProfile }: Props) {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const assetContext = useContext(AssetContext);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [savedAvatar, setSavedAvatar] = useState<string | null>(fullProfile.avatarUrl);
  const [savedBanner, setSavedBanner] = useState<string | null>(fullProfile.bannerUrl);
  const [resolvedAvatar, setResolvedAvatar] = useState<string | null>(fullProfile.avatarUrl);
  const [resolvedBanner, setResolvedBanner] = useState<string | null>(fullProfile.bannerUrl);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: fullProfile.username,
      email: fullProfile.email,
      firstName: fullProfile.firstName ?? "",
      lastName: fullProfile.lastName ?? "",
      bio: fullProfile.bio ?? "",
      country: fullProfile.country ?? "",
      city: fullProfile.city ?? "",
    },
    mode: "onTouched",
  });

  const resolveImage = (image: File | null, setResolvedImage: (image: string | null) => void) => {
    if (!image) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        setResolvedImage(fileReader.result);
      }
    };
  };

  useEffect(() => {
    resolveImage(selectedAvatar, setResolvedAvatar);
  }, [selectedAvatar]);

  useEffect(() => {
    resolveImage(selectedBanner, setResolvedBanner);
  }, [selectedBanner]);

  const uploadAsset = async (
    asset: File | null,
    endpoints: {
      requestUploadEndpoint: string,
      notifyUploadEndpoint: string,
      removeEndpoint: string,
    },
  ) => {
    const error = await assetContext.uploadAsset(endpoints, asset);
    return {
      success: error === null || error === "remove_success",
      error,
    };
  };

  const handleSubmit = async (data: EditProfileForm) => {
    setIsLoading(true);
    const profileRequest = userContext.protectedFetch(editProfileEndpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => ({
      success: !isRequestError(response),
      error: response.status === 409
        ? "Credentials are already used"
        : isRequestError(response)
          ? "Failed to save profile information"
          : null,
    }));

    const requests = [
      profileRequest,
      ...(resolvedAvatar !== savedAvatar ? [
        uploadAsset(selectedAvatar, {
          requestUploadEndpoint: requestUploadAvatarEndpoint,
          notifyUploadEndpoint: notifyUploadAvatarEndpoint,
          removeEndpoint: removeAvatarEndpoint,
        }),
      ] : []),
      ...(resolvedBanner !== savedBanner ? [
        uploadAsset(selectedBanner, {
          requestUploadEndpoint: requestUploadBannerEndpoint,
          notifyUploadEndpoint: notifyUploadBannerEndpoint,
          removeEndpoint: removeBannerEndpoint,
        }),
      ] : []),
    ];
    const results = await Promise.all(requests);
    const successful = results.some(result => result.success);
    const errors = results
      .filter(result => !result.success && result.error)
      .map(result => result.error);

    if (errors.length > 0) {
      toastContext.show({
        title: "Some profile changes failed",
        description: errors.join(". "),
        type: "error",
      });
    }
    if (successful) {
      toastContext.show({
        title: "Profile changes saved",
        type: "success",
      });
    }

    if (results[0].success) {
      form.reset(data);
    }
    if (resolvedAvatar !== savedAvatar && results[1]?.success) {
      setSavedAvatar(resolvedAvatar);
      setSelectedAvatar(null);
    }
    const bannerResultIndex = resolvedAvatar !== savedAvatar ? 2 : 1;
    if (resolvedBanner !== savedBanner && results[bannerResultIndex]?.success) {
      setSavedBanner(resolvedBanner);
      setSelectedBanner(null);
    }
    setIsLoading(false);
  };

  const hasChanges = form.formState.isDirty
    || resolvedAvatar !== savedAvatar
    || resolvedBanner !== savedBanner;

  const reset = () => {
    form.reset();
    setResolvedAvatar(savedAvatar);
    setResolvedBanner(savedBanner);
    setSelectedAvatar(null);
    setSelectedBanner(null);
  };

  return (
    <form className="w-full" onSubmit={form.handleSubmit(handleSubmit)}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit profile information</CardTitle>
        </CardHeader>
        <EditProfileImageForm
          avatarUrl={fullProfile.avatarUrl}
          bannerUrl={fullProfile.bannerUrl}
          resolvedAvatar={resolvedAvatar}
          resolvedBanner={resolvedBanner}
          onAvatarChange={setSelectedAvatar}
          onBannerChange={setSelectedBanner}
        />
        <EditProfileInformationForm form={form} />
        <CardFooter className="w-full flex gap-2 justify-end">
          <Button
            className="cursor-pointer relative"
            disabled={!form.formState.isValid || !hasChanges || isLoading}
            type="submit"
          >
            {isLoading && (
              <div className="absolute w-full h-full flex items-center justify-center">
                <Spinner />
              </div>
            )}
            <span className={isLoading ? "opacity-0" : ""}>Save</span>
          </Button>
          <Button
            className="cursor-pointer"
            variant="outline"
            type="button"
            onClick={reset}
            disabled={isLoading}
          >
            Reset
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default EditProfileForms;
