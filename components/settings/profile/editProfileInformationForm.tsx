"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { editProfileEndpoint } from "@/constants/api"
import { ToastContext } from "@/context/toastContext"
import { UserContext } from "@/context/userContext"
import { EditProfileForm, editProfileSchema } from "@/types/settings/forms"
import { FullProfile } from "@/types/user/profile"
import { zodResolver } from "@hookform/resolvers/zod"
import { useContext, useState } from "react"
import { Controller, useForm } from "react-hook-form"

interface Params {
  fullProfile: FullProfile,
};

function EditProfileInformationForm({ fullProfile }: Params) {
  const [isLoading, setIsLoading] = useState(false);
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
    mode: "onTouched",
  });
  const resetEditProfileForm = () => {
    editProfileForm.setValues({ ...editProfileFormDefaultValues });
  }

  const handleEditProfile = async () => {
    setIsLoading(true);

    const res = await userContext.protectedFetch(editProfileEndpoint, {
      method: "PUT",
      body: JSON.stringify(editProfileForm.getValues()),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 409) {
      toastContext.show({
        title: "Credentials are already used",
        description: "Try using another username or email",
        type: "error",
      });
    } else if (res.status !== 200) {
      toastContext.show({
        title: "Failed to save profile information",
        description: "Unknown error",
        type: "error",
      });
    } else {
      toastContext.show({
        title: "Successfully saved profile information",
        type: "success",
      });
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit profile information</CardTitle>
      </CardHeader>
      <CardContent>
        <fieldset disabled={isLoading}>
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
      <CardFooter className="w-full flex gap-2 justify-end">
        <Button
          className="cursor-pointer relative"
          disabled={!editProfileForm.formState.isValid}
          onClick={handleEditProfile}
        >
          { isLoading ?
            <div className="absolute w-full h-full flex items-center justify-center">
              <Spinner />
            </div> : <></>
          }
          <span className={isLoading ? "opacity-0" : ""}>Save</span>
        </Button>
        <Button
          className="cursor-pointer"
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