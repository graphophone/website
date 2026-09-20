"use client"

import { UserContext } from "@/context/userContext"
import React, { useContext, useEffect } from "react"
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userContext = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!userContext.isLoading && userContext.user === null) {
      router.push("/auth/login");
    }
  }, [userContext.isLoading, userContext.user]);

  if (userContext.isLoading) {
    return (
      <Spinner className="size-8" />
    )
  }

  if (userContext.user === null) {
    return <></>;
  }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute