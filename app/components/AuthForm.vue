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
    <h1>{{ t(`auth.${mode}.title`) }}</h1>

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
  max-width: 400px;
  padding: 2rem 0;
}

.auth h1 {
  margin: 0 0 1.5rem;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
}

.form {
  display: grid;
  gap: 1.25rem;
}

.field {
  display: grid;
  gap: 0.35rem;
  font-weight: 600;
}

.field small {
  font-weight: 400;
  color: var(--color-muted);
}

.field input {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font: inherit;
  font-weight: 400;
  background: transparent;
  color: inherit;
}

.error {
  margin: 0;
  color: #b3261e;
}

.button {
  padding: 0.6rem 1.1rem;
  border: 0;
  border-radius: 8px;
  background: var(--color-text);
  color: var(--color-bg);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.button:disabled {
  opacity: 0.6;
  cursor: progress;
}

.switch {
  margin: 1.5rem 0 0;
  color: var(--color-muted);
}

.switch a {
  color: var(--color-text);
  font-weight: 600;
}
</style>
