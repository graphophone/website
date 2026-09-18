import * as z from 'zod';

export const signUpSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(16, "Description must be at most 16 characters"),
    email: z.email(),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password must be at most 16 characters")
        .refine(v => v.toLowerCase() !== v, {
            error: "Password must include uppercase character",
        })
        .refine(v => v.toUpperCase() !== v, {
            error: "Password must include lowercase character",
        })
        .refine(v => /.*[0-9].*/.test(v), {
            error: "Password must include a number",
        })
        .refine(v => /.*[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~].*/.test(v), {
            error: "Password must include special character",
        }),
    firstName: z.string()
        .max(16, "First name must be at most 16 characters")
        .optional(),
    lastName: z.string()
        .max(16, "Last name must be at most 16 characters")
        .optional(),
});

export type SignUpForm = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export type LoginForm = z.infer<typeof loginSchema>;