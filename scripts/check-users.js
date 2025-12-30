const mongoose = require('mongoose');

// MongoDB 連線字串 (從你的 mongoDb.md 取得)
const MONGODB_URI = "mongodb+srv://shedy:uZbjMO3V25csNBoA@modellibrary.isg8bsq.mongodb.net/ModelLibrary";

async function checkData() {
try {
    console.log("正在連線到 MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("連線成功！\n");

    // 取得集合 (Collections)
    const db = mongoose.connection.db;
    
    console.log("--- 使用者列表 (Users) ---");
    const users = await db.collection('users').find({}).toArray();
    if (users.length === 0) {
    console.log("目前沒有使用者資料。");
    } else {
    users.forEach(user => {
        console.log(`ID: ${user._id}, Username: ${user.userName}, Email: ${user.email}, Role: ${user.role}`);
    });
    }

    console.log("\n--- 帳號驗證列表 (Accounts) ---");
    const accounts = await db.collection('accounts').find({}).toArray();
    if (accounts.length === 0) {
    console.log("目前沒有帳號驗證資料。");
    } else {
    accounts.forEach(account => {
        console.log(`ID: ${account._id}, UserID: ${account.userId}, Provider: ${account.provider}, HasPassword: ${!!account.password}`);
    });
    }

} catch (error) {
    console.error("發生錯誤:", error);
} finally {
    await mongoose.disconnect();
    console.log("\n已斷開連線。");
}
}

checkData();