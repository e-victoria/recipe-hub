import type { H3Event } from 'h3'
import { FetchError } from 'ofetch'
import type { components } from '~/types/api'

type AuthSession = components['schemas']['AuthSession']
type User = components['schemas']['User']

// The API token lives only in this httpOnly cookie: page scripts can't read it, so an XSS bug
// can't steal it. The server attaches it to API calls in server/api/[...path].ts.
const SESSION_COOKIE = 'recipe-hub.session'

export function apiURL(path: string): string {
  return `${useRuntimeConfig().apiBase.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

export function getSessionToken(event: H3Event): string | undefined {
  return getCookie(event, SESSION_COOKIE)
}

export function clearSessionCookie(event: H3Event): void {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

/** Log in or register through the API, keep the token in the cookie and return only the user. */
export async function startSession(event: H3Event, path: string, body: unknown): Promise<User> {
  try {
    const session = await $fetch<AuthSession>(apiURL(path), {
      method: 'POST',
      body,
      // The API rate-limits registrations per address, so pass on the browser's, not ours.
      // getRequestIP ignores X-Forwarded-For: behind a load balancer, configure the trust there.
      headers: { 'x-forwarded-for': getRequestIP(event) ?? '' },
    })
    setCookie(event, SESSION_COOKIE, session.token, {
      httpOnly: true,
      secure: !import.meta.dev,
      sameSite: 'lax',
      path: '/',
      expires: new Date(session.expires_at),
    })
    return session.user
  } catch (error) {
    if (error instanceof FetchError && error.response) {
      throw createError({ statusCode: error.response.status, data: error.data })
    }
    throw createError({ statusCode: 502, statusMessage: 'API unavailable' })
  }
}
