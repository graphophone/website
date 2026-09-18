"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { ToastContext } from "@/context/toastContext"
import { UserContext } from "@/context/userContext"
import { SignUpForm, signUpSchema } from "@/types/auth/forms"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeSlash } from "phosphor-react"
import { useContext, useState } from "react"
import { Controller, useForm } from "react-hook-form"

function SignUp() {
  const router = useRouter();
  const toastContext = useContext(ToastContext);
  const userContext = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    mode: 'onTouched',
  });

  const handleSignUp = async (data: SignUpForm) => {
    const status = await userContext.signUp(data);
    if (status === 200) {
      toastContext.show({
        title: "Signed up successfully",
        type: "success",
      });
      router.push('/');
    } else if (status === 201) {
      toastContext.show({
        title: "Created account successfully",
        type: "success",
      });
      router.push('/auth/login');
    } else {
      toastContext.show({
        title: "Failed to login",
        description: status === 409 ?
          "Credentials are already used" :
          "Unknown error",
        type: "error",
      });
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="sign-up-form" onSubmit={signUpForm.handleSubmit(handleSignUp)}>
          <FieldGroup>
            <Controller
              name="username"
              control={signUpForm.control}
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
              control={signUpForm.control}
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

            <Controller
              name="password"
              control={signUpForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      type={showPassword ? "text" : "password"}
                      className="placeholder:text-foreground/50"
                    />
                    <InputGroupButton
                      variant="link"
                      className="cursor-pointer h-full p-2"
                      onClick={() => setShowPassword(v => !v)}
                    >
                      { showPassword ?
                        <EyeSlash color="var(--foreground)" /> :
                        <Eye color="var(--foreground)" />
                      }
                    </InputGroupButton>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-2">
              <Controller
                name="firstName"
                control={signUpForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="firstName">
                      First name
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
                control={signUpForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lastName">
                      Last name
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          disabled={!signUpForm.formState.isValid}
          form="sign-up-form"
          type="submit"
          className="w-full cursor-pointer"
        >
          Sign up
        </Button>
        <Link href="/auth/login" className="w-full" >
          <Button className="w-full cursor-pointer" variant="outline">
            Login
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default SignUp