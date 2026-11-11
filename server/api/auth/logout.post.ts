export default defineEventHandler(async (event) => {
  const token = getSessionToken(event)
  if (token) {
    // Best effort: if the API is down the session simply expires later, and this browser is
    // logged out either way once the cookie is gone.
    await $fetch(apiURL('auth/logout'), {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
    }).catch(() => {})
  }
  clearSessionCookie(event)
  setResponseStatus(event, 204)
  return null
})
