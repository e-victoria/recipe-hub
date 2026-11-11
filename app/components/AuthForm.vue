<script setup lang="ts">
import type { AuthMode } from '~/utils/auth'

const props = defineProps<{ mode: AuthMode }>()

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const auth = useAuth()

const email = ref('')
const password = ref('')
const submitting = ref(false)
const errorKey = ref<string | null>(null)

const isLogin = computed(() => props.mode === 'login')
const otherPath = computed(() =>
  localePath({ path: isLogin.value ? '/register' : '/login', query: route.query }),
)

async function submit() {
  submitting.value = true
  errorKey.value = null
  try {
    const body = { email: email.value, password: password.value }
    await (isLogin.value ? auth.login(body) : auth.register(body))
    await navigateTo(safeRedirect(route.query.redirect, localePath('/recipes')))
  } catch (error) {
    errorKey.value = authErrorKey((error as { statusCode?: number }).statusCode, props.mode)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="auth">
    <h1 class="page-title">{{ t(`auth.${mode}.title`) }}</h1>

    <form class="form" @submit.prevent="submit">
      <label class="field">
        <span>{{ t('auth.fields.email') }}</span>
        <input v-model="email" type="email" required maxlength="254" autocomplete="email" />
      </label>

      <label class="field">
        <span>{{ t('auth.fields.password') }}</span>
        <input
          v-model="password"
          type="password"
          required
          :minlength="isLogin ? undefined : 8"
          maxlength="128"
          :autocomplete="isLogin ? 'current-password' : 'new-password'"
        />
        <small v-if="!isLogin">{{ t('auth.hints.password') }}</small>
      </label>

      <p v-if="errorKey" class="error" role="alert">{{ t(errorKey) }}</p>

      <div>
        <button class="button" type="submit" :disabled="submitting">
          {{ submitting ? t(`auth.${mode}.submitting`) : t(`auth.${mode}.submit`) }}
        </button>
      </div>
    </form>

    <p class="switch">
      {{ t(`auth.${mode}.switch`) }}
      <NuxtLink :to="otherPath">{{ t(`auth.${mode}.switchLink`) }}</NuxtLink>
    </p>
  </section>
</template>

<style scoped>
.auth {
  max-width: 22rem;
  margin: 0 auto;
  padding: 4rem 0;
}

.auth h1 {
  margin-bottom: 1.75rem;
}

.form {
  display: grid;
  gap: 1.25rem;
}

.form .button {
  width: 100%;
}

.switch {
  margin: 1.5rem 0 0;
  color: var(--color-muted);
  font-size: 0.9375rem;
}

.switch a {
  color: var(--color-text);
  font-weight: 500;
}
</style>
