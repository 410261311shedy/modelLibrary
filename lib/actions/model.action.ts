"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUserModels() {
    const session = await auth();

    if(!session?.user.id){
        return {success: false, error: "Unauthorized"};
    }
    try {
        const models = await prisma.model.findMany({
        where: {
            uploaderId: session.user.id,
            status: 'completed', 
        },
        orderBy: {
            createdAt: 'desc', // 最新的在最上面
        },
        });

        return { success: true, data: models };
    } catch (error) {
        console.error("Failed to fetch models:", error);
        return { success: false, error: "Failed to fetch models" };
    }
}