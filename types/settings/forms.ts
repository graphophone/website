import * as z from 'zod';

export const editProfileSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(16, "Description must be at most 16 characters"),
    email: z.email(),
    firstName: z.string()
        .max(16, "First name must be at most 16 characters")
        .optional(),
    lastName: z.string()
        .max(16, "Last name must be at most 16 characters")
        .optional(),
    bio: z.string()
        .max(120, "Bio must be at most 120 characters")
        .optional(),
    country: z.string()
        .max(24, "Country must be at most 24 characters")
        .optional(),
    city: z.string()
        .max(24, "City must be at most 24 characters")
        .optional(),
});

export type EditProfileForm = z.infer<typeof editProfileSchema>;
