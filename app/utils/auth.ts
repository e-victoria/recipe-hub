export type AuthMode = 'login' | 'register'

/** `value` if it is a path inside this app, else `fallback`: a redirect must never leave the site. */
export function safeRedirect(value: unknown, fallback: string): string {
  if (typeof value !== 'string' || !value.startsWith('/')) {
    return fallback
  }
  // "//host" and "/\host" are read by browsers as another site.
  return value.startsWith('//') || value.startsWith('/\\') ? fallback : value
}

/** The translation key for a failed login or registration, from the API's status code. */
export function authErrorKey(status: number | undefined, mode: AuthMode): string {
  switch (status) {
    case 401:
      return 'auth.error.invalid'
    case 409:
      return 'auth.error.taken'
    case 422:
      // At login, a malformed email can't match an account, so say what any failure says.
      return mode === 'login' ? 'auth.error.invalid' : 'auth.error.invalidInput'
    case 429:
      return 'auth.error.tooMany'
    default:
      return 'auth.error.generic'
  }
}
