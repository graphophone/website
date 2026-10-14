"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import { UploadTrackForm, uploadTrackSchema } from '@/types/track/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';
import CategoriesSelect from '@/components/upload-track/categoriesSelect';
import ThumbnailUpload from '@/components/upload-track/thumbnailUpload';
import { CategoryData } from '@/types/category/category';
import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { UserContext } from '@/context/userContext';
import { isRequestError } from '@/lib/error';
import { ToastContext } from '@/context/toastContext';
import { useRouter } from 'next/navigation';
import AudioUpload from '@/components/upload-track/audioUpload';
import { AssetContext } from '@/context/assetContext';
import { notifyUploadThumbnailEndpoint, removeThumbnailEndpoint, requestUploadThumbnailEndpoint, uploadTrackEndpoint } from '@/constants/api';

function UploadTrackInformationPage() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const assetContext = useContext(AssetContext);
  const [isLoading, setIsLoading] = useState(false);

  const uploadTrackForm = useForm<UploadTrackForm>({
    resolver: zodResolver(uploadTrackSchema),
    defaultValues: {
      title: '',
      description: undefined,
      categories: [],
      thumbnail: undefined,
      audio: undefined,
    },
    mode: 'onTouched',
  });
  
  const handleThumbnailUpload = async (trackId: number, thumbnail?: File) => {
    const uploadError = await assetContext.uploadImage({
      requestUploadEndpoint: requestUploadThumbnailEndpoint(trackId),
      notifyUploadEndpoint: notifyUploadThumbnailEndpoint(trackId),
      removeEndpoint: removeThumbnailEndpoint(trackId),
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
    } else {
      toastContext.show({
        title: "Thumbnail uploaded",
        type: "success",
      });
    }
  };

  const handleAudioUpload = async (trackId: number, audio?: File) => {
    let body = null;
    if (audio) {
      const formData = new FormData();
      formData.append('audio', audio);
      body = formData;
    }
    const uploadAudioRes = await new Promise<Response>((resolve) => {
      setTimeout(() => {
        resolve({ status: 404 } as Response);
      }, 3000);
    });

    if (isRequestError(uploadAudioRes)) {
      toastContext.show({
        title: "Failed to upload audio",
        description: "You can upload it separately later",
        type: "error",
      });
    }
  };

  const handleSubmit = async (data: UploadTrackForm) => {
    setIsLoading(true);

    const uploadRes = await userContext.protectedFetch(uploadTrackEndpoint, {
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
        title: "Failed to upload track data",
        description: "Try again later",
        type: "error",
      });
      setIsLoading(false);
      return;
    }
    
    const trackId = await uploadRes.json();

    const thumbnailUploadPromise = handleThumbnailUpload(trackId, data.thumbnail);
    const audioUploadPromise = handleAudioUpload(trackId, data.audio);
    await Promise.allSettled([
      thumbnailUploadPromise,
      audioUploadPromise,
    ]);

    toastContext.show({
      title: "Uploaded successfully",
      type: "success",
    });
    router.push(`/track/${trackId}`);
  };

  const resetForm = () => {
    uploadTrackForm.setValues({
      title: '',
      description: '',
      categories: [],
      thumbnail: undefined,
    });
  }

  return (
    <Card className="w-[80vh] md:w-full">
      <CardHeader>
        <CardTitle>Enter track data</CardTitle>
      </CardHeader>
      <CardContent>
        <fieldset disabled={false}>
          <form id="edit-profile-form" onSubmit={uploadTrackForm.handleSubmit(handleSubmit)}>
            <FieldGroup className="flex flex-col md:flex-row gap-4.5">
              <Controller
                name="thumbnail"
                control={uploadTrackForm.control}
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
                control={uploadTrackForm.control}
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
                  control={uploadTrackForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="title">
                        Title
                      </FieldLabel>
                      <Input
                        {...field}
                        id="title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Track title"
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
                  control={uploadTrackForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="categories">
                        Categories for the track
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
                  control={uploadTrackForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">
                        Description (optional)
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="description"
                          placeholder="Tell something the track"
                          rows={3}
                          className="resize-none placeholder:text-foreground/50"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums text-foreground/50">
                            {field.value?.length ?? 0}/120 characters
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
          disabled={!uploadTrackForm.formState.isValid || isLoading}
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

export default UploadTrackInformationPage