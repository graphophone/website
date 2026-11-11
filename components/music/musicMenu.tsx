"use client";

import { deleteMusicEndpoint } from "@/constants/api";
import { ToastContext } from "@/context/toastContext";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { DotsThree, Flag, Pencil, Trash } from "phosphor-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ConfirmDialog from "../confirmDialog";

interface Props {
  musicId: number;
  isOwner: boolean;
  isUploaded: boolean;
  onDeleted: () => void;
}

function MusicMenu({ musicId, isOwner, isUploaded, onDeleted }: Props) {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    const response = await userContext.protectedFetch(deleteMusicEndpoint(musicId), {
      method: "DELETE",
    });
    toastContext.show({
      title: isRequestError(response) ? "Failed to delete music" : "Music deleted",
      type: isRequestError(response) ? "error" : "success",
    });
    if (!isRequestError(response)) {
      onDeleted();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              className="shrink-0 cursor-pointer text-foreground"
              variant="outline"
              size="icon"
              aria-label="More options"
            />
          }
        >
          <DotsThree />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isOwner && (
            <DropdownMenuItem onClick={() => router.push(`/music/${musicId}/edit`)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
          )}
          {isOwner && isUploaded && (
            <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash />
              Delete
            </DropdownMenuItem>
          )}
          {!isOwner && (
            <DropdownMenuItem>
              <Flag />
              Report this track
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete this track?"
        description="The track will be removed permanently."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </>
  );
}

export default MusicMenu;
