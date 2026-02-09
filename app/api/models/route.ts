// app/api/models/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth"; 

export async function POST(req: Request) {
    try {
        // 1. 檢查使用者權限
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. 接收 FormData
        const formData = await req.formData();
        
        // 3. 解析欄位
        const metadataString = formData.get("metadata") as string;
        const coverImage = formData.get("coverImage") as string; // Base64 string
        const files = formData.getAll("files") as File[];

        if (!metadataString) {
            return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        const metadata = JSON.parse(metadataString);

        console.log("API Received:", {
            user: session.user.email,
            metadata,
            filesCount: files.length,
            coverImageLength: coverImage?.length
        });

        // TODO: 這裡可以加入資料庫儲存邏輯 (例如 Prisma)
        // TODO: 這裡可以加入檔案上傳到雲端儲存的邏輯 (例如 S3 / R2)

        return NextResponse.json({ 
            success: true, 
            message: "Model created successfully",
            modelId: "mock-id-123" // 模擬回傳建立的 ID
        }, { status: 201 });

    } catch (error) {
        console.error("Error in create model API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
