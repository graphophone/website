import { ShortMusic } from "../music/music";
import { MyProfile } from "../user/profile";

export interface CommentEntry {
    commentId: number;
    content: string;
    likesCount: number;
    isLiked: boolean;
    createdAt: number;
}

export interface MusicCommentEntry extends CommentEntry {
    profile: MyProfile | null;
}

export interface MusicCommentsPage {
    totalPages: number;
    comments: MusicCommentEntry[];
}

export interface UserCommentEntry extends CommentEntry {
    music: ShortMusic | null;
}

export interface UserCommentsPage {
    totalPages: number;
    comments: UserCommentEntry[];
}
