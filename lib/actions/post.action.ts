"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; // 你的 auth 設定
import { Metadata } from "@/components/forms/MetadataForm";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

interface CreatePostParams {
    metadata: Metadata;
    coverImageKey: string | null;
    imageKeys: string[];
    modelId: string;
}

export async function create3DPost(params: CreatePostParams) {
    const shortId = nanoid(10);
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // 寫入 PostgreSQL
        const newPost = await prisma.post.create({
        data: {
            shortId: shortId,
            title: params.metadata.title,
            category: params.metadata.category,
            description: params.metadata.description,
            type:"3D",
            keywords: params.metadata.keywords,            
            coverImage: params.coverImageKey!,
            images: params.imageKeys,
            
            modelId: params.modelId, // 關聯選中的模型
            uploaderId: session.user.id,

            permission: params.metadata.permission,
            team: params.metadata.team === "none" ? null : params.metadata.team,
        },
        });

        return { success: true, postId: newPost.id };

    } catch (error) {
        console.error("Create post failed:", error);
        return { success: false, error: "Database error" };
    }
}