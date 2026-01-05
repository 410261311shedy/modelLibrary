// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";
import Account from "@/models/account.model";
import { SignInSchema } from "@/lib/validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
// Configure authentication providers
providers: [
    Google,
    Credentials({
    // Custom credentials login logic
    credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
        // 1. Validate input format against SignInSchema (now using username)
        const validatedData = SignInSchema.safeParse(credentials);

        if (validatedData.success) {
        const { username, password } = validatedData.data;

        // 2. Connect to the database
        await dbConnect();

        // 3. Find user by userName (switched from email)
        const user = await User.findOne({ userName: username });
        if (!user) return null;

        // 4. Find corresponding account credentials
        const account = await Account.findOne({
            userId: user._id,
            provider: "credentials",
        });

        // Reject if no account found or no password (e.g., OAuth-only users)
        if (!account || !account.password) return null;

        // 5. Compare provided password with hashed password
        const passwordMatch = await bcrypt.compare(password, account.password);

        // 6. If password matches, return user info to be stored in JWT
        if (passwordMatch) {
            return {
            id: user._id.toString(),
            name: user.userName,
            email: user.email,
            image: user.image,
            };
        }
        }

        // Authentication failed
        return null;
    },
    }),
],
callbacks: {
    async signIn({ user, account }) {
    if (account?.provider === "credentials") return true;

    if (!user.email || !user.name) return false;

    await dbConnect();

    const existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
        // Create new user if they don't exist
        const [newUser] = await User.create([
        {
            userName: user.name.replace(/\s+/g, "").toLowerCase(), // Basic username formatting
            email: user.email,
            image: user.image,
            role: "Free",
        },
        ]);

        // Create corresponding Account record
        await Account.create([
        {
            userId: newUser._id,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
        },
        ]);
    } else {
        // If user exists, check if they already have an Account for this provider
        const existingAccount = await Account.findOne({
        userId: existingUser._id,
        provider: account?.provider,
        });

        if (!existingAccount) {
        await Account.create([
            {
            userId: existingUser._id,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
            },
        ]);
        }
    }

    return true;
    },
    // Triggered when JWT is created or updated
    async jwt({ token, user, account }) {
    if (user) {
        token.id = user.id;
    }
    return token;
    },
    // Triggered when session is accessed, passes info from JWT to frontend
    async session({ session, token }) {
    if (session.user && token.id) {
        session.user.id = token.id as string;
    }

    // For OAuth logins, ensure the session has the correct database ID
    if (session.user && !session.user.id && session.user.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
        session.user.id = dbUser._id.toString();
        }
    }

    return session;
    },
},
});