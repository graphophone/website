"use client";

import { commentEndpoint } from "@/constants/api";
import { ToastContext } from "@/context/toastContext";
import { UserContext } from "@/context/userContext";
import { isRequestError } from "@/lib/error";
import { formatCreatedAt } from "@/lib/utils";
import type { MusicComment } from "@/types/comment/comment";
import { useContext, useState } from "react";
import { DotsThree, Pencil, Trash } from "phosphor-react";
import UserChip from "../user/userChip";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Textarea } from "../ui/textarea";
import ConfirmDialog from "../confirmDialog";

interface Props {
  comment: MusicComment;
  onUpdated: (content: string) => void;
  onDeleted: () => void;
}

function CommentCard({ comment, onUpdated, onDeleted }: Props) {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isOwner = comment.profile !== null && userContext.user?.userId === comment.profile.userId;
  const trimmedContent = content.trim();

  const handleEdit = () => {
    setContent(comment.content);
    setIsEditing(true);
  };

  const handleReset = () => {
    setContent(comment.content);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!trimmedContent || isSaving) {
      return;
    }

    setIsSaving(true);
    const response = await userContext.protectedFetch(commentEndpoint(comment.commentId), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newContent: trimmedContent }),
    });
    setIsSaving(false);

    if (isRequestError(response)) {
      toastContext.show({
        title: "Failed to edit comment",
        description: "Try again later",
        type: "error",
      });
      return;
    }

    onUpdated(trimmedContent);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const response = await userContext.protectedFetch(commentEndpoint(comment.commentId), {
      method: "DELETE",
    });

    if (isRequestError(response)) {
      toastContext.show({
        title: "Failed to delete comment",
        description: "Try again later",
        type: "error",
      });
      return;
    }

    onDeleted();
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border p-2">
      <div className="flex items-center justify-between gap-2">
        {comment.profile ?
          <UserChip profile={comment.profile} /> :
          <span className="text-sm text-foreground/50">Failed to get user</span>
        }
        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground/70">
            {formatCreatedAt(comment.createdAt)}
          </span>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    className="shrink-0 cursor-pointer text-foreground"
                    variant="ghost"
                    size="icon"
                    aria-label="Comment options"
                  />
                }
              >
                <DotsThree />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {isEditing ?
        <div className="flex flex-col gap-2">
          <Textarea
            value={content}
            onChange={event => setContent(event.target.value)}
            className="text-sm text-foreground"
            disabled={isSaving}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={handleReset}
              disabled={isSaving}
            >
              Reset
            </Button>
            <Button
              type="button"
              className="cursor-pointer"
              onClick={handleSave}
              disabled={isSaving || !trimmedContent || trimmedContent === comment.content}
            >
              Save
            </Button>
          </div>
        </div> :
        <p className="text-sm [overflow-wrap:anywhere] whitespace-pre-wrap">{comment.content}</p>
      }

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete this comment?"
        description="The comment will be removed permanently."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default CommentCard;
