import { z } from "zod";

//{} use this to pass in the shape of the object
export const SignInSchema = z.object({
   //define different fields we have to define the value for form,
   //define the validation to make sure the users havr to enter the values of a proper type
    email: z
        //custom email message
        .email({ message: "Please provide a valid email address." })
        //min character of 1 and with a custom message
        .min(1, { message: "Email is required." }),

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

    name: z
        .string()
        .min(1, { message: "Name is required." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .regex(/^[a-zA-Z\s]+$/, {
            message: "Name can only contain letters and spaces.",
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