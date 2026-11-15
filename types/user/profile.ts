export interface BasicProfile {
    userId: number;
    username: string;
    avatarUrl: string | null;
    followersCount?: number;
}

export interface UserProfile extends BasicProfile {
    bannerUrl: string | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    country: string | null;
    city: string | null;
}

export interface FollowsCount {
    followersCount: number;
    followingsCount: number;
    isFollowed: boolean;
}

export interface SettingsProfile extends UserProfile {
    email: string;
}