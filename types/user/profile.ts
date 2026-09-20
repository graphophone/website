export interface Profile {
    userId: number;
    username: string;
    avatarUrl: string | null;
    bannerUrl: string | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    country: string | null;
    city: string | null;
}

export interface FullProfile extends Profile {
    email: string;
}