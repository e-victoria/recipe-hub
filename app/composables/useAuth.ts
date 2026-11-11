import type { LoginRequest, RegisterRequest, User } from '~/types'

export function useAuth() {
  // undefined: not known yet (not checked, or the API was unreachable); null: logged out.
  const user = useState<User | null | undefined>('auth-user', () => undefined)
  // Forwards the browser's cookie when this runs during server rendering.
  const requestFetch = useRequestFetch()

  async function refresh() {
    try {
      user.value = await requestFetch<User>('/api/auth/me')
    } catch (error) {
      if ((error as { statusCode?: number }).statusCode === 401) {
        user.value = null
      }
    }
  }

  async function login(body: LoginRequest) {
    user.value = await $fetch<User>('/api/auth/login', { method: 'POST', body })
  }

  async function register(body: RegisterRequest) {
    user.value = await $fetch<User>('/api/auth/register', { method: 'POST', body })
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    clearNuxtData() // Don't leave the last user's recipes in memory for the next one.
  }

  return { user, refresh, login, register, logout }
}
