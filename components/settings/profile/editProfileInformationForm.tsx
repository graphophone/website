"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { EditProfileForm } from "@/types/settings/forms"
import { Controller, UseFormReturn } from "react-hook-form"

interface Params {
  editProfileForm: UseFormReturn<EditProfileForm>,
  resetEditProfileForm: () => void,
};

function EditProfileInformationForm({ editProfileForm, resetEditProfileForm }: Params) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit profile information</CardTitle>
      </CardHeader>
      <CardContent>
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
                      rows={4}
                      className="min-h-16 resize-none placeholder:text-foreground/50"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-foreground/50">
                        {field.value?.length ?? 0}/100 characters
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
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          className="w-full cursor-pointer"
          variant="outline"
          onClick={resetEditProfileForm}
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  )
}

export default EditProfileInformationForm