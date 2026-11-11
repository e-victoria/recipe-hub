import type { ImageCreate, MediaUpload } from '~/types'

export type MediaKind = 'images' | 'videos'

// Checked here so a bad file is refused before the recipe is saved. The API enforces the same limits.
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const VIDEO_TYPES = ['video/mp4', 'video/webm']
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024

export function mediaKind(file: Pick<File, 'type'>): MediaKind | null {
  if (IMAGE_TYPES.includes(file.type)) {
    return 'images'
  }
  return VIDEO_TYPES.includes(file.type) ? 'videos' : null
}

// The translation key for why a file can't be added, or null if it can.
export function mediaProblem(file: Pick<File, 'type' | 'size'>): string | null {
  const kind = mediaKind(file)
  if (kind === null) {
    return 'media.error.type'
  }
  if (file.size === 0) {
    return 'media.error.empty'
  }
  const limit = kind === 'images' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES
  return file.size > limit ? 'media.error.size' : null
}

export interface MediaApi {
  start(kind: MediaKind, file: File): Promise<MediaUpload>
  put(upload: MediaUpload, file: File): Promise<void>
  confirm(kind: MediaKind, body: ImageCreate): Promise<void>
  // Null when the browser can't tell; the size is only a layout hint.
  imageSize(file: File): Promise<{ width: number, height: number } | null>
}

async function uploadOne(file: File, api: MediaApi): Promise<void> {
  const kind = mediaKind(file)
  if (kind === null) {
    throw new Error(`unsupported file type: ${file.type}`)
  }
  const upload = await api.start(kind, file)
  await api.put(upload, file)
  const size = kind === 'images' ? await api.imageSize(file) : null
  await api.confirm(kind, { storage_key: upload.storage_key, ...size })
}

// One at a time, so files keep the chosen order. A failure doesn't stop the rest.
export async function uploadMedia(
  files: File[],
  api: MediaApi,
  onProgress: (current: number) => void = () => {},
): Promise<File[]> {
  const failed: File[] = []
  for (const [index, file] of files.entries()) {
    onProgress(index + 1)
    try {
      await uploadOne(file, api)
    } catch {
      failed.push(file)
    }
  }
  return failed
}
