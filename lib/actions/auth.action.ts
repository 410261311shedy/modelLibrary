"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";
import Account from "@/models/account.model";
import { SignUpSchema } from "@/lib/validations";



/**
 * 使用憑證（電子郵件與密碼）進行註冊的 Server Action
 * @param params 包含 username, email, password 的物件
 */
export async function signUpWithCredentials(params: AuthCredentials) {
  const { username, email, password } = params;

  // 1. 基本檢查：確保必要欄位存在
  if (!username || !password) {
    return { success: false, error: "Username and password are required" };
  }

  // 2. 使用 Zod Schema 進行資料驗證
  const validationResult = SignUpSchema.safeParse({ username, email, password, name: username });

  if (!validationResult.success) {
    // 回傳第一個驗證錯誤訊息
    return { success: false, error: validationResult.error.issues[0].message };
  }

  // 3. 連接資料庫
  await dbConnect();

  // 4. 開啟 Mongoose Session 以進行交易（Transaction）
  // 確保 User 和 Account 同時建立成功，若其中一個失敗則全部回滾
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 5. 檢查電子郵件是否已被註冊
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // 6. 檢查使用者名稱是否已被佔用
    const existingUsername = await User.findOne({ userName: username }).session(session);
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    // 7. 密碼雜湊處理（Hashing）
    const hashedPassword = await bcrypt.hash(password, 12);

    // 8. 建立使用者基本資料 (User Model)
    const [newUser] = await User.create(
      [
        {
          userName: username,
          email,
          role: "Free",
        },
      ],
      { session }
    );

    // 9. 建立帳號驗證資料 (Account Model)
    // 將雜湊後的密碼存入 Account，並關聯到剛建立的 User ID
    await Account.create(
      [
        {
          userId: newUser._id,
          password: hashedPassword,
          provider: "credentials",
          providerAccountId: newUser._id.toString(),
        },
      ],
      { session }
    );

    // 10. 提交交易
    await session.commitTransaction();

    return { success: true };
  } catch (error: unknown) {
    // 發生錯誤時，如果交易還在進行中，則回滾所有變更
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  } finally {
    // 無論成功或失敗，最後都要關閉 Session
    session.endSession();
  }
}
