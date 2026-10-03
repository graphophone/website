"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import { UploadTrackForm, uploadTrackSchema } from '@/types/upload-track/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';
import CategoriesSelect from '@/components/upload-track/categoriesSelect';
import ThumbnailUpload from '@/components/upload-track/thumbnailUpload';
import { CategoryData } from '@/types/category/category';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

function UploadTrackInformationPage() {
  const [isLoading, setIsLoading] = useState(false);

  const uploadTrackForm = useForm<UploadTrackForm>({
    resolver: zodResolver(uploadTrackSchema),
    defaultValues: {
      title: '',
      description: '',
      categories: [],
      thumbnail: undefined,
    },
    mode: 'onTouched',
  });

  const handleSubmit = async (data: UploadTrackForm) => {
    setIsLoading(true);


    setIsLoading(false);
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
                        uploadTrackForm.setValue("thumbnail", selectedImage ?? undefined);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grow flex flex-col gap-2">
                <div className="flex gap-2 items-baseline justify-center">
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
                          onChange={(value: CategoryData[]) => {
                            uploadTrackForm.setValue("categories", [...value]);
                          }}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

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
          disabled={!uploadTrackForm.formState.isValid}
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