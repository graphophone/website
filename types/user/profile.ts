export interface BasicProfile {
    userId: number;
    username: string;
    avatarUrl: string | null;
}

export interface Profile extends BasicProfile {
    bannerUrl: string | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    country: string | null;
    city: string | null;
}

export interface SettingsProfile extends Profile {
    email: string;
}