// utils/cropImage.ts

export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // 避免跨域問題
        image.src = url
    })

/**
 * 取得裁切後的圖片 URL
 * @param {string} imageSrc - 圖片來源網址或 Base64
 * @param {Object} pixelCrop - react-easy-crop 回傳的裁切數據 { x, y, width, height }
 */
export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string | null> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

  // 設定 canvas 大小為裁切區域的大小
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

  // 在 canvas 上繪製裁切部分的圖片
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

  // 轉換為 Blob 並回傳 ObjectURL
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
        if (!blob) {
            console.error('Canvas is empty')
            return
        }
        resolve(URL.createObjectURL(blob))
        }, 'image/jpeg')
    })
}
