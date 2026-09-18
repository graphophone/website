"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label"
import { ToastContext } from "@/context/toastContext";
import { UserContext } from "@/context/userContext";
import { LoginForm, loginSchema } from "@/types/auth/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Eye, EyeSlash } from "phosphor-react";
import { useContext, useState } from "react"
import { Controller, useForm } from "react-hook-form";

function Login() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const handleLogin = async (data: LoginForm) => {
    const status = await userContext.login(data);
    if (status === 200) {
      toastContext.show({
        title: "Logged in successfully",
        type: "success",
      });
      router.push("/");
    } else {
      toastContext.show({
        title: "Failed to login",
        description: status === 401 ?
          "Incorrect credentials" :
          "Unknown error",
        type: "error",
      });
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={loginForm.handleSubmit(handleLogin)}>
          <FieldGroup>
            <Controller
              name="username"
              control={loginForm.control}
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
                    className="placeholder:text-foreground/50"
                  />
                  { fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={loginForm.control}
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          disabled={!loginForm.formState.isValid}
          form="login-form"
          type="submit"
          className="w-full cursor-pointer"
        >
          Login
        </Button>
        <Link href="/auth/sign-up" className="w-full" >
          <Button className="w-full cursor-pointer" variant="outline">
            Sign Up
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default Login