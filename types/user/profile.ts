export interface BasicProfile {
    userId: number;
    username: string;
    avatarUrl: string | null;
    followersCount?: number;
}

export interface MyProfile extends BasicProfile {
    bannerUrl: string | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    country: string | null;
    city: string | null;
}

export interface UserProfile extends Omit<MyProfile, "followersCount"> {
    followersCount: number | null;
    followingsCount: number | null;
}

export interface SettingsProfile extends MyProfile {
    email: string;
}