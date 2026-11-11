import { describe, expect, it, vi } from 'vitest'
import {
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  mediaKind,
  mediaProblem,
  uploadMedia,
  type MediaApi,
} from '../app/utils/recipeMedia'

function file(name: string, type: string): File {
  return new File(['x'], name, { type })
}

function fakeApi(overrides: Partial<MediaApi> = {}): MediaApi {
  return {
    start: vi.fn(async (_kind, f: File) => ({ storage_key: `key-${f.name}`, upload_url: `url-${f.name}` })),
    put: vi.fn(async () => {}),
    confirm: vi.fn(async () => {}),
    imageSize: vi.fn(async () => ({ width: 800, height: 600 })),
    ...overrides,
  }
}

describe('mediaKind', () => {
  it.each([
    ['image/jpeg', 'images'],
    ['image/png', 'images'],
    ['image/webp', 'images'],
    ['video/mp4', 'videos'],
    ['video/webm', 'videos'],
    ['image/gif', null],
    ['video/quicktime', null],
    ['', null],
  ])('%s is %s', (type, kind) => {
    expect(mediaKind({ type })).toBe(kind)
  })
})

describe('mediaProblem', () => {
  it('accepts files up to the limit', () => {
    expect(mediaProblem({ type: 'image/png', size: MAX_IMAGE_BYTES })).toBeNull()
    expect(mediaProblem({ type: 'video/mp4', size: MAX_VIDEO_BYTES })).toBeNull()
  })

  it('refuses files over the limit for their kind', () => {
    expect(mediaProblem({ type: 'image/png', size: MAX_IMAGE_BYTES + 1 })).toBe('media.error.size')
    expect(mediaProblem({ type: 'video/mp4', size: MAX_VIDEO_BYTES + 1 })).toBe('media.error.size')
  })

  it('allows a video larger than the image limit', () => {
    expect(mediaProblem({ type: 'video/mp4', size: MAX_IMAGE_BYTES + 1 })).toBeNull()
  })

  it('refuses other types and empty files', () => {
    expect(mediaProblem({ type: 'application/pdf', size: 1 })).toBe('media.error.type')
    expect(mediaProblem({ type: 'image/png', size: 0 })).toBe('media.error.empty')
  })
})

describe('uploadMedia', () => {
  it('starts, puts and confirms an image with its size', async () => {
    const api = fakeApi()
    const photo = file('a.png', 'image/png')

    expect(await uploadMedia([photo], api)).toEqual([])

    expect(api.start).toHaveBeenCalledWith('images', photo)
    expect(api.put).toHaveBeenCalledWith({ storage_key: 'key-a.png', upload_url: 'url-a.png' }, photo)
    expect(api.confirm).toHaveBeenCalledWith('images', { storage_key: 'key-a.png', width: 800, height: 600 })
  })

  it('confirms an image without a size when the browser cannot read one', async () => {
    const api = fakeApi({ imageSize: vi.fn(async () => null) })

    await uploadMedia([file('a.png', 'image/png')], api)

    expect(api.confirm).toHaveBeenCalledWith('images', { storage_key: 'key-a.png' })
  })

  it('confirms a video without measuring it', async () => {
    const api = fakeApi()

    await uploadMedia([file('a.mp4', 'video/mp4')], api)

    expect(api.imageSize).not.toHaveBeenCalled()
    expect(api.confirm).toHaveBeenCalledWith('videos', { storage_key: 'key-a.mp4' })
  })

  it('uploads in the chosen order and reports progress', async () => {
    const api = fakeApi()
    const onProgress = vi.fn()

    await uploadMedia([file('a.png', 'image/png'), file('b.png', 'image/png')], api, onProgress)

    expect(vi.mocked(api.confirm).mock.calls.map(([, body]) => body.storage_key)).toEqual(['key-a.png', 'key-b.png'])
    expect(onProgress.mock.calls).toEqual([[1], [2]])
  })

  it('carries on after a failure and returns what failed', async () => {
    const bad = file('bad.png', 'image/png')
    const good = file('good.png', 'image/png')
    const api = fakeApi({
      put: vi.fn(async (upload) => {
        if (upload.storage_key === 'key-bad.png') {
          throw new Error('network')
        }
      }),
    })

    expect(await uploadMedia([bad, good], api)).toEqual([bad])

    expect(api.confirm).toHaveBeenCalledTimes(1)
    expect(api.confirm).toHaveBeenCalledWith('images', expect.objectContaining({ storage_key: 'key-good.png' }))
  })
})
