"use client"

import { deleteAccountEndpoint } from "@/constants/api"
import { ToastContext } from "@/context/toastContext"
import { UserContext } from "@/context/userContext"
import { isRequestError } from "@/lib/error"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { Trash } from "phosphor-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import ConfirmDialog from "@/components/confirmDialog"

function DeleteAccountSection() {
  const userContext = useContext(UserContext)
  const toastContext = useContext(ToastContext)
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
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
    <CardContent className="flex flex-col gap-4 border-t pt-4 mt-4 md:mt-0 md:pt-0 md:border-t-0 md:border-l">
      <span className="font-semibold text-destructive">Danger zone</span>
      <div className="flex flex-col gap-4">
        <span className="text-foreground/70">
          Deleting your account removes your profile and related data permanently.
        </span>
        <Button
          type="button"
          variant="destructive"
          className="w-fit shrink-0 cursor-pointer"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash weight="fill" />
          Delete account
        </Button>
      </div>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete your account?"
        description="This cannot be undone. Your profile and all uploaded music will be removed permanently."
        confirmLabel="Delete account"
        onConfirm={handleDelete}
      />
    </CardContent>
  )
}

export default DeleteAccountSection
