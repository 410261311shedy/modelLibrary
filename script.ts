import {prisma} from './lib/prisma';

async function main() {
  // 1. 嘗試建立一筆新的 Model 資料
  const newModel = await prisma.model.create({
    data: {
      shortId: 'test-short-id',
      name: 'Test IFC Model',
      fileId: 'test-file-id-001',
      uploader: 'TestUser',
      size: 1024,
      status: 'uploading',
    },
  })
  console.log('✨ 成功建立模型:', newModel)

  // 2. 查詢所有 Model 資料
  const allModels = await prisma.model.findMany()
  console.log('📦 目前資料庫中的模型:', allModels)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })