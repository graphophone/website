import { MyProfile } from "../user/profile";

export interface MusicComment {
    commentId: number;
    profile: MyProfile | null;
    content: string;
    createdAt: number;
}

export interface CommentsPage {
    totalPages: number;
    comments: MusicComment[];
}
