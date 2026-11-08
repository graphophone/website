import { CategoryData } from "../category/category";
import { BasicProfile } from "../user/profile";

export interface FullMusicData {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    durationSeconds?: number;
    playCount: number;
    likeCount: number;
    isLiked: boolean,
    uploader: BasicProfile;
    categories: CategoryData[];
    uploadStatus: string;
    createdAt: number,
}