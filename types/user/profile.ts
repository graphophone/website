export interface UserProfile {
    user_id: number;
    username: string;
    avatar_url: string | null;
    first_name: string | null;
    last_name: string | null;
    bio: string | null;
    country: string | null;
    city: string | null;
}