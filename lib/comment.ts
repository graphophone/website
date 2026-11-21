import type { CommentEntry } from "@/types/comment/comment";

export function withoutDuplicates<T extends CommentEntry>(currentComments: T[], newComments: T[]) {
  const currentIds = new Set(currentComments.map(item => item.commentId));
  return newComments.filter(item => !currentIds.has(item.commentId));
}

export function withToggledLike<T extends CommentEntry>(comment: T): T {
  return {
    ...comment,
    isLiked: !comment.isLiked,
    likesCount: comment.likesCount + (comment.isLiked ? -1 : 1),
  };
}
