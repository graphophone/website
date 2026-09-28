"use client"

import { CategoryInfo } from '@/types/category/category';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react';
import { searchCategoriesEndpoint } from '@/constants/api';
import { isRequestError } from '@/lib/error';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import { UploadTrackForm, uploadTrackSchema } from '@/types/upload-track/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';
import { Trash, UploadSimple } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

function UploadTrackInformationPage() {
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

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [resolvedImage, setResolvedImage] = useState<string | null>(null);
  const [isThumbnailHovered, setIsThumbnailHovered] = useState(false);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  const searchCategories = async (searchToken: string) => {
    setIsCategoriesLoading(false);
    const url = new URL(searchCategoriesEndpoint);
    url.searchParams.append("searchToken", searchToken);
    const res = await fetch(url, {
      method: "GET",
    });
    if (isRequestError(res)) {
      const categories: CategoryInfo[] = await res.json();
      setCategories(categories);
    } else {
      setCategories([]);
    }
    setIsCategoriesLoading(false);
  };

  useEffect(() => {
    if (selectedImage === null) {
      setResolvedImage(null);
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedImage);
    fileReader.onload = () => {
      let imageBase64 = fileReader.result;
      if (imageBase64 instanceof ArrayBuffer) {
        imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imageBase64)));
      }
      console.log('read image');
      setResolvedImage(imageBase64);
    };
  }, [selectedImage]);

  return (
    <Card className="w-[80vh] md:w-full">
      <CardHeader>
        <CardTitle>Enter track data</CardTitle>
      </CardHeader>
      <CardContent>
        <fieldset disabled={false}>
          <form id="edit-profile-form">
            <FieldGroup className="flex flex-col md:flex-row gap-4.5">
              <div className="h-full flex gap-4.5 items-center">
                <div className="h-48 relative">
                  <input
                    onChange={e => setSelectedImage(e.target?.files?.item(0) ?? null)}
                    className="w-full h-full absolute opacity-0 z-10 cursor-pointer"
                    accept="image/png, image/jpeg"
                    type="file"
                    name={`thumbnail-input`}
                    id={`thumbnail-input`}
                  />
                  <Card className="w-48 h-48 relative">
                    <CardContent className="w-full h-full">
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <UploadSimple className="size-8 opacity-50 z-0" />
                        <div className="w-full text-center opacity-50">
                          Press or drag to select the thumbnail
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                { resolvedImage ?
                  <div
                    className="w-48 h-48 relative rounded-[6px] overflow-clip"
                    onMouseEnter={() => setIsThumbnailHovered(true)}
                    onMouseLeave={() => setIsThumbnailHovered(false)}  
                  >
                    { isThumbnailHovered ?
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 left-2 z-10 cursor-pointer bg-foreground/65 hover:bg-foreground/85"
                      >
                        <Trash weight="fill" />
                      </Button> : <></>
                    }
                    <Image
                      src={resolvedImage}
                      alt="Selected thumbnail"
                      fill={true}
                      style={{ objectFit: "cover" }}
                    />
                  </div> : <div className="w-48 h-48 opacity-0" />
                }
              </div>

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
                        <Input
                          id="categories"
                          placeholder="e.g. Lo-Fi, Jazz, Religious"
                          aria-invalid={fieldState.invalid}
                          className="placeholder:text-foreground/50"
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
    </Card>
  )
}

export default UploadTrackInformationPage