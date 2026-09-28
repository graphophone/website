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

  return (
    <Card className="w-[80vh] md:w-full">
      <CardHeader>
        <CardTitle>Enter track data</CardTitle>
      </CardHeader>
      <CardContent>
        <fieldset disabled={false}>
          <form id="edit-profile-form">
            <FieldGroup>
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
                      Select categories of your track
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
            </FieldGroup>
          </form>
        </fieldset>
      </CardContent>
    </Card>
  )
}

export default UploadTrackInformationPage