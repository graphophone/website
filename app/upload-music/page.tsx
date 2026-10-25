"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import { UploadMusicForm, uploadMusicSchema } from '@/types/music/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';
import CategoriesSelect from '@/components/upload-music/categoriesSelect';
import ThumbnailUpload from '@/components/upload-music/thumbnailUpload';
import { CategoryData } from '@/types/category/category';
import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { UserContext } from '@/context/userContext';
import { isRequestError } from '@/lib/error';
import { ToastContext } from '@/context/toastContext';
import { useRouter } from 'next/navigation';
import AudioUpload from '@/components/upload-music/audioUpload';
import { AssetContext } from '@/context/assetContext';
import { notifyUploadThumbnailEndpoint, notifyUploadMusicAudioEndpoint, removeThumbnailEndpoint, requestUploadThumbnailEndpoint, requestUploadMusicAudioEndpoint, uploadMusicEndpoint } from '@/constants/api';

function UploadMusicInformationPage() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const assetContext = useContext(AssetContext);
  const [isLoading, setIsLoading] = useState(false);

  const uploadMusicForm = useForm<UploadMusicForm>({
    resolver: zodResolver(uploadMusicSchema),
    defaultValues: {
      title: '',
      description: undefined,
      categories: [],
      thumbnail: undefined,
      audio: undefined,
    },
    mode: 'onTouched',
  });

  const handleThumbnailUpload = async (musicId: number, thumbnail?: File) => {
    const uploadError = await assetContext.uploadAsset({
      requestUploadEndpoint: requestUploadThumbnailEndpoint(musicId),
      notifyUploadEndpoint: notifyUploadThumbnailEndpoint(musicId),
      removeEndpoint: removeThumbnailEndpoint(musicId),
    }, thumbnail ?? null);

    if (uploadError === "remove_fail") {
      toastContext.show({
        title: "Failed to remove thumbnail",
        type: "error",
      });
    } else if (uploadError === "request_upload_fail") {
      toastContext.show({
        title: "Failed to request upload thumbnail",
        type: "error",
      });
    } else if (uploadError === "upload_fail") {
      toastContext.show({
        title: "Failed to upload thumbnail",
        type: "error",
      });
    } else if (uploadError === "notify_upload_fail") {
      toastContext.show({
        title: "Failed to notify upload thumbnail",
        type: "error",
      });
    }
  };

  const handleAudioUpload = async (musicId: number, audio: File) => {
    const uploadError = await assetContext.uploadAsset({
      requestUploadEndpoint: requestUploadMusicAudioEndpoint(musicId),
      notifyUploadEndpoint: notifyUploadMusicAudioEndpoint(musicId),
      removeEndpoint: 'never used',
    }, audio);

    if (uploadError === "remove_fail") {
      toastContext.show({
        title: "Failed to remove audio",
        type: "error",
      });
    } else if (uploadError === "request_upload_fail") {
      toastContext.show({
        title: "Failed to request upload audio",
        type: "error",
      });
    } else if (uploadError === "upload_fail") {
      toastContext.show({
        title: "Failed to upload audio",
        type: "error",
      });
    } else if (uploadError === "notify_upload_fail") {
      toastContext.show({
        title: "Failed to notify upload audio",
        type: "error",
      });
    }
  };

  const handleSubmit = async (data: UploadMusicForm) => {
    if (!data.audio) {
      return;
    }
    setIsLoading(true);

    const uploadRes = await userContext.protectedFetch(uploadMusicEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description ?? null,
        categoriesIds: data.categories.map(category => category.id),
      }),
    });
    if (isRequestError(uploadRes)) {
      toastContext.show({
        title: "Failed to upload music data",
        description: "Try again later",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    const musicId = await uploadRes.json();
    const requests = [];
    if (data.thumbnail) {
      requests.push(handleThumbnailUpload(musicId, data.thumbnail));
    }
    requests.push(handleAudioUpload(musicId, data.audio));
    await Promise.allSettled(requests);

    toastContext.show({
      title: "Uploaded successfully",
      type: "success",
    });
    router.push(`/music/${musicId}`);
  };

  const resetForm = () => {
    uploadMusicForm.setValues({
      title: '',
      description: '',
      categories: [],
      thumbnail: undefined,
    });
  }

  return (
    <Card className="w-[80vh] md:w-full">
      <CardHeader>
        <CardTitle>Enter music data</CardTitle>
      </CardHeader>
      <CardContent>
        <fieldset disabled={false}>
          <form id="edit-profile-form" onSubmit={uploadMusicForm.handleSubmit(handleSubmit)}>
            <FieldGroup className="flex flex-col md:flex-row gap-4.5">
              <Controller
                name="thumbnail"
                control={uploadMusicForm.control}
                render={({ field, fieldState }) => (
                  <Field className="w-fit h-fit">
                    <FieldLabel>
                      Thumbnail
                    </FieldLabel>
                    <ThumbnailUpload
                      onSelect={selectedImage => {
                        field.onChange(selectedImage ?? undefined);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="audio"
                control={uploadMusicForm.control}
                render={({ field, fieldState }) => (
                  <Field className="w-fit h-fit">
                    <FieldLabel>
                      Audio
                    </FieldLabel>
                    <AudioUpload
                      selectedAudio={field.value}
                      onSelect={selectedAudio => {
                        field.onChange(selectedAudio ?? undefined);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grow flex flex-col gap-2">
                <Controller
                  name="title"
                  control={uploadMusicForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="title">
                        Title
                      </FieldLabel>
                      <Input
                        {...field}
                        id="title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Music title"
                        autoComplete="off"
                        className="placeholder:text-foreground/50"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="categories"
                  control={uploadMusicForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="categories">
                        Categories for the music
                      </FieldLabel>
                      <CategoriesSelect
                        selected={field.value}
                        invalid={fieldState.invalid}
                        onChange={(value: CategoryData[]) => {
                          field.onChange([...value]);
                        }}
                        onBlur={field.onBlur}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="description"
                  control={uploadMusicForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">
                        Description (optional)
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="description"
                          placeholder="Tell something the music"
                          rows={3}
                          className="resize-none placeholder:text-foreground/50"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums text-foreground/50">
                            {field.value?.length ?? 0}/360 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </form>
        </fieldset>
      </CardContent>
      <CardFooter>
        <Button
          className="cursor-pointer relative"
          disabled={!uploadMusicForm.formState.isValid || isLoading}
          type="submit"
          form="edit-profile-form"
        >
          {isLoading ?
            <div className="absolute w-full h-full flex items-center justify-center">
              <Spinner />
            </div> : <></>
          }
          <span className={isLoading ? "opacity-0" : ""}>Save</span>
        </Button>
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={resetForm}
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  )
}

export default UploadMusicInformationPage