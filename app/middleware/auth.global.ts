// Pages anyone can open; every other page needs a logged-in user.
const PUBLIC_PAGES = new Set(['index', 'login', 'register'])
// Pages that make no sense once logged in.
const GUEST_PAGES = new Set(['login', 'register'])

export default defineNuxtRouteMiddleware(async (to) => {
  const { user, refresh } = useAuth()
  if (user.value === undefined) {
    await refresh()
  }

  const page = useRouteBaseName()(to) ?? ''
  const localePath = useLocalePath()

  if (user.value === null && !PUBLIC_PAGES.has(page)) {
    return navigateTo(localePath({ path: '/login', query: { redirect: to.fullPath } }))
  }
  if (user.value && GUEST_PAGES.has(page)) {
    return navigateTo(safeRedirect(to.query.redirect, localePath('/recipes')))
  }
})
