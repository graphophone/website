export interface UserProfile {
    userId: number;
    username: string;
    avatarUrl: string | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    country: string | null;
    city: string | null;
}