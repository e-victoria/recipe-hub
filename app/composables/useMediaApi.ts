import type { MediaUpload } from '~/types'

async function imageSize(file: File) {
  try {
    const bitmap = await createImageBitmap(file)
    const size = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return size
  } catch {
    return null
  }
}

// Returns a factory, so a page can get the API before it knows the recipe's slug.
export function useMediaApi() {
  const baseURL = '/api'

  return (slug: string): MediaApi => ({
    start: (kind, file) => $fetch<MediaUpload>(`/recipes/${slug}/${kind}/uploads`, {
      baseURL,
      method: 'POST',
      body: { content_type: file.type, size_bytes: file.size },
    }),
    put: async (upload, file) => {
      await $fetch(upload.upload_url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
    },
    confirm: async (kind, body) => {
      await $fetch(`/recipes/${slug}/${kind}`, { baseURL, method: 'POST', body })
    },
    imageSize,
  })
}
