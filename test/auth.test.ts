import { describe, expect, it } from 'vitest'
import { authErrorKey, safeRedirect } from '../app/utils/auth'

describe('safeRedirect', () => {
  it.each(['/recipes', '/ru/recipes/borshch', '/recipes?locale=pl'])('keeps the in-app path %s', (path) => {
    expect(safeRedirect(path, '/fallback')).toBe(path)
  })

  it.each([
    ['another site', 'https://evil.example/'],
    ['a protocol-relative URL', '//evil.example'],
    ['a backslash trick', '/\\evil.example'],
    ['a relative path', 'recipes'],
    ['nothing', undefined],
    ['a repeated query value', ['/a', '/b']],
  ])('falls back for %s', (_name, value) => {
    expect(safeRedirect(value, '/fallback')).toBe('/fallback')
  })
})

describe('authErrorKey', () => {
  it.each([
    [401, 'login', 'auth.error.invalid'],
    [422, 'login', 'auth.error.invalid'],
    [409, 'register', 'auth.error.taken'],
    [422, 'register', 'auth.error.invalidInput'],
    [429, 'login', 'auth.error.tooMany'],
    [429, 'register', 'auth.error.tooMany'],
    [500, 'login', 'auth.error.generic'],
    [undefined, 'register', 'auth.error.generic'],
  ] as const)('maps %s on %s to %s', (status, mode, key) => {
    expect(authErrorKey(status, mode)).toBe(key)
  })
})
