"use client"

import { CategoryInfo } from '@/types/category/category';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react';
import { searchCategoriesEndpoint } from '@/constants/api';
import { isRequestError } from '@/lib/error';
import { FieldGroup } from '@/components/ui/field';
import { Controller } from 'react-hook-form';

async function UploadTrackInformationPage() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [categoriesSearchToken, setCategoriesSearchToken] = useState('');

  const searchCategories = async () => {
    setIsCategoriesLoading(false);
    const res = await fetch(searchCategoriesEndpoint, {
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
  }, [categoriesSearchToken]);

  return (
    <Card className="w-[80vh] md:w-full">
      <CardHeader>
        <CardTitle>Enter track data</CardTitle>
      </CardHeader>
      <CardContent>
        <fieldset disabled={false}>
          <form id="edit-profile-form">
            <FieldGroup>
              <div className="flex gap-2">
                <Controller
                  name="username"
                  control={editProfileForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="username">
                        Username
                      </FieldLabel>
                      <Input
                        {...field}
                        id="username"
                        aria-invalid={fieldState.invalid}
                        placeholder="my_username"
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
                  name="email"
                  control={editProfileForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="my@mail.tutu"
                        className="placeholder:text-foreground/50"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Controller
                  name="firstName"
                  control={editProfileForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="firstName">
                        First name (Optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="firstName"
                        placeholder="Alina"
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
                  name="lastName"
                  control={editProfileForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lastName">
                        Last name (Optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="lastName"
                        aria-invalid={fieldState.invalid}
                        placeholder="Smith"
                        className="placeholder:text-foreground/50"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Controller
                  name="country"
                  control={editProfileForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="country">
                        Country (optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="country"
                        placeholder="Poland"
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
                  name="city"
                  control={editProfileForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="city">
                        City (optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="city"
                        aria-invalid={fieldState.invalid}
                        placeholder="Warsaw"
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
                name="bio"
                control={editProfileForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="bio">
                      Bio (optional)
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="bio"
                        placeholder="Tell something about yourself"
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