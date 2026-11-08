export interface UserMusic {
    id: number;
    title: string;
    thumbnailUrl?: string;
    durationSeconds?: number;
    playCount: number;
    likeCount: number;
    uploadStatus: string;
    isLiked: boolean;
}

export interface UserMusicPage {
    musicEntries: UserMusic[];
    totalPages: number;
}
