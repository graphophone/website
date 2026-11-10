"use client"

import { changePasswordEndpoint } from "@/constants/api"
import { ToastContext } from "@/context/toastContext"
import { UserContext } from "@/context/userContext"
import { isRequestError } from "@/lib/error"
import { ChangePasswordForm as ChangePasswordFormData, changePasswordSchema } from "@/types/settings/forms"
import { zodResolver } from "@hookform/resolvers/zod"
import { useContext, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

function ChangePasswordForm() {
  const userContext = useContext(UserContext)
  const toastContext = useContext(ToastContext)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onTouched",
  })

  const handleSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true)
    const response = await userContext.protectedFetch(changePasswordEndpoint, {
      method: "PUT",
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (isRequestError(response)) {
      toastContext.show({
        title: "Failed to change password",
        type: "error",
      })
    } else {
      toastContext.show({
        title: "Password changed",
        type: "success",
      })
      form.reset()
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <CardContent className="flex flex-col gap-4">
        <span className="font-semibold">Change password</span>
        <FieldGroup>
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="currentPassword">
                  Current password
                </FieldLabel>
                <Input
                  {...field}
                  id="currentPassword"
                  type="password"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="flex flex-col md:flex-row gap-4 md:gap-2">
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="newPassword">
                    New password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="newPassword"
                    type="password"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmNewPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmNewPassword">
                    Repeat new password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirmNewPassword"
                    type="password"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
        <Button
          className="w-fit self-end cursor-pointer relative"
          disabled={!form.formState.isValid || isLoading}
          type="submit"
        >
          {isLoading && (
            <div className="absolute w-full h-full flex items-center justify-center">
              <Spinner />
            </div>
          )}
          <span className={isLoading ? "opacity-0" : ""}>Change password</span>
        </Button>
      </CardContent>
    </form>
  )
}

export default ChangePasswordForm
