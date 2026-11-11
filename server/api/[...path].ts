// Everything under /api goes to recipe-hub-api with the session token attached, so the browser
// only ever talks to this server. Login, register and logout have their own handlers.
export default defineEventHandler((event) => {
  const path = event.path.replace(/^\/api\//, '')

  // Only /auth/me may pass through: the other auth routes return a token, which must stay on
  // the server. Matched loosely, so "/auth/login/" or "/AUTH/login" can't slip past either.
  if (/^auth\b/i.test(path) && !/^auth\/me(\?|$)/.test(path)) {
    throw createError({ statusCode: 404 })
  }

  const token = getSessionToken(event)
  return proxyRequest(event, apiURL(path), {
    fetch: (url, init) => {
      const headers = new Headers(init?.headers)
      headers.delete('cookie') // The API needs none of this site's cookies.
      headers.delete('authorization')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      // Never follow a redirect: the response must come from the path we checked.
      return fetch(url, { ...init, headers, redirect: 'manual' })
    },
    onResponse: (event, response) => {
      if (response.status === 401) {
        clearSessionCookie(event) // Expired or ended elsewhere: stop sending it.
      }
    },
  })
})
