"use client"

import { editMusicEndpoint, notifyUploadThumbnailEndpoint, removeThumbnailEndpoint, requestUploadThumbnailEndpoint } from "@/constants/api";
import { AssetContext } from "@/context/assetContext";
import { ToastContext } from "@/context/toastContext";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { CategoryData } from "@/types/category/category";
import { editMusicSchema, type EditMusicForm } from "@/types/music/forms";
import { FullMusicData } from "@/types/music/music";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "../ui/input-group";
import { Spinner } from "../ui/spinner";
import CategoriesSelect from "../upload-music/categoriesSelect";
import ThumbnailUpload from "../upload-music/thumbnailUpload";

function EditMusicForm({ musicData }: { musicData: FullMusicData }) {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const assetContext = useContext(AssetContext);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<EditMusicForm>({
    resolver: zodResolver(editMusicSchema),
    defaultValues: {
      title: musicData.title,
      description: musicData.description ?? "",
      categories: musicData.categories,
      thumbnail: undefined,
    },
    mode: "onTouched",
  });

  const handleSubmit = async (data: EditMusicForm) => {
    setIsLoading(true);
    const response = await userContext.protectedFetch(editMusicEndpoint(musicData.id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description ?? null,
        categoriesIds: data.categories.map(category => category.id),
      }),
    });

    if (isRequestError(response)) {
      toastContext.show({
        title: "Failed to update music data",
        description: "Try again later",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    if (data.thumbnail) {
      const uploadError = await assetContext.uploadAsset({
        requestUploadEndpoint: requestUploadThumbnailEndpoint(musicData.id),
        notifyUploadEndpoint: notifyUploadThumbnailEndpoint(musicData.id),
        removeEndpoint: removeThumbnailEndpoint(musicData.id),
      }, data.thumbnail);

      if (uploadError) {
        toastContext.show({
          title: "Failed to update thumbnail",
          description: "Try again later",
          type: "error",
        });
        setIsLoading(false);
        return;
      }
    }

    toastContext.show({
      title: "Updated successfully",
      type: "success",
    });
    router.push(`/music/${musicData.id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit music</CardTitle>
      </CardHeader>
      <CardContent>
        <fieldset disabled={isLoading}>
          <form id="edit-music-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup className="flex flex-col md:flex-row gap-4.5">
              <Controller
                name="thumbnail"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-fit h-fit">
                    <FieldLabel>Thumbnail</FieldLabel>
                    <ThumbnailUpload
                      initialImage={musicData.thumbnailUrl}
                      onSelect={selectedImage => field.onChange(selectedImage ?? undefined)}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className="grow flex flex-col gap-2">
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="title">Title</FieldLabel>
                      <Input
                        {...field}
                        id="title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Music title"
                        autoComplete="off"
                        className="placeholder:text-foreground/50"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="categories"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="categories">Categories for the music</FieldLabel>
                      <CategoriesSelect
                        selected={field.value}
                        invalid={fieldState.invalid}
                        onChange={(value: CategoryData[]) => field.onChange(value)}
                        onBlur={field.onBlur}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">Description (optional)</FieldLabel>
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
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
          disabled={isLoading}
          type="submit"
          form="edit-music-form"
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
          onClick={() => form.reset()}
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EditMusicForm;
