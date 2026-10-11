import { CategoryData } from "../category/category";
import { BasicProfile } from "../user/profile";

export interface FullTrackData {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    durationSeconds?: number;
    playCount: number;
    likeCount: number;
    uploader: BasicProfile;
    categories: CategoryData;
    uploadStatus: string;
    createdAt: Date,
}