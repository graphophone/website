import * as z from 'zod';

export const uploadMusicSchema = z.object({
    title: z.string()
        .min(3, "Music title must be at least 3 characters")
        .max(64, "Music title must be at most  characters"),
    description: z.string()
        .max(360, "Description must be at most 360 characters")
        .optional(),
    categories: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
        }),
    )
        .min(1)
        .max(3),
    thumbnail: z.instanceof(File)
        .refine(
            file => [
                "image/png",
                "image/jpeg",
            ].includes(file.type),
            { error: "Invalid image" },
        )
        .optional(),
    audio: z.instanceof(File)
        .refine(
            file => !!file,
            { error: "Audio file is required" },
        )
        .refine(
            file => [
                "audio/mpeg",
                "audio/wav",
            ].includes(file.type),
            { error: "Invalid audio" },
        ),
});

export type UploadMusicForm = z.infer<typeof uploadMusicSchema>;