import * as z from 'zod';

export const uploadTrackSchema = z.object({
    title: z.string()
        .min(3, "Track title must be at least 3 characters")
        .max(16, "Track title must be at most 16 characters"),
    description: z.string()
        .max(120, "Description must be at most 120 characters")
        .optional(),
    categories: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
        }),
    ),
    thumbnail: z.instanceof(File)
        .refine(
            file => [
                "image/png",
                "image/jpeg",
            ].includes(file.type),
            { error: "Invalid image" },
        )
        .optional(),
});

export type UploadTrackForm = z.infer<typeof uploadTrackSchema>;