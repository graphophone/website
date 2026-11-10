"use client"

import { deleteAccountEndpoint } from "@/constants/api"
import { ToastContext } from "@/context/toastContext"
import { UserContext } from "@/context/userContext"
import { isRequestError } from "@/lib/error"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { Trash } from "phosphor-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"

function DeleteAccountSection() {
  const userContext = useContext(UserContext)
  const toastContext = useContext(ToastContext)
  const router = useRouter()

  const handleDelete = async () => {
    if (!window.confirm("Delete your account? This cannot be undone.")) {
      return
    }

    const response = await userContext.protectedFetch(deleteAccountEndpoint, {
      method: "DELETE",
    })
    if (isRequestError(response)) {
      toastContext.show({
        title: "Failed to delete account",
        type: "error",
      })
      return
    }

    await userContext.logout()
    router.push("/")
  }

  return (
    <CardContent className="flex flex-col gap-4 border-t pt-4">
      <span className="font-semibold text-destructive">Danger zone</span>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <span className="text-foreground/70">
          Deleting your account removes your profile and related data permanently.
        </span>
        <Button
          type="button"
          variant="destructive"
          className="w-fit shrink-0 cursor-pointer"
          onClick={handleDelete}
        >
          <Trash weight="fill" />
          Delete account
        </Button>
      </div>
    </CardContent>
  )
}

export default DeleteAccountSection
