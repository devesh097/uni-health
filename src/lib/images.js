import { createId } from './ids'

const MAX_FILE_BYTES = 8 * 1024 * 1024
const MAX_DIMENSION = 1400
const JPEG_QUALITY = 0.72

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('The selected image could not be read.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The selected image could not be processed.'))
    image.src = src
  })
}

export async function prepareImageFile(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error(`${file.name} is not a supported image file.`)
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`${file.name} is larger than 8 MB.`)
  }

  const source = await readAsDataUrl(file)
  const image = await loadImage(source)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Image processing is not available in this browser.')

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)

  return {
    id: createId('doc'),
    name: file.name,
    type: 'image/jpeg',
    size: Math.round((dataUrl.length * 3) / 4),
    dataUrl,
    uploadedAt: new Date().toISOString(),
  }
}
