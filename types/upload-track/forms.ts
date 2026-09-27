import * as z from 'zod';

export const uploadTrackForm = z.object({
    title: z.string()
        .min(3, "Track title must be at least 3 characters")
        .max(16, "Track title must be at most 16 characters"),
    description: z.string()
        .max(120, "Description must be at most 120 characters")
        .optional(),
    email: z.email(),
});
