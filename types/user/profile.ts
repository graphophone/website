export interface MyProfile {
    userId: number;
    username: string;
    avatarUrl: string | null;
}

export interface BasicProfile extends MyProfile {
    followsCount?: FollowsCount | null;
}

export interface UserProfile extends MyProfile {
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

export interface FollowsPage {
    totalPages: number;
    profiles: BasicProfile[];
}

export interface SettingsProfile extends UserProfile {
    email: string;
}