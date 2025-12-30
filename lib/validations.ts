import { z } from "zod";

// Schema for Sign In - username-based authentication
export const SignInSchema = z.object({
    // Username validation for login
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long." })
        .max(30, { message: "Username cannot exceed 30 characters." })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message:
            "Username can only contain letters, numbers, and underscores.",
        }),

    password: z
        .string()
        .min(6, { message: "password must be at least 6 characters." })
        .max(100, { message: "password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long." })
        .max(30, { message: "Username cannot exceed 30 characters." })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message:
            "Username can only contain letters, numbers, and underscores.",
        }),

    email: z
        .email({ message: "Please provide a valid email address." })
        .min(1, { message: "Email is required." }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .max(100, { message: "Password cannot exceed 100 characters." })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, { message: "Password must contain at least one number." }),
    });