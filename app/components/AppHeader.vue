<script setup lang="ts">
const { locale, locales, setLocale, t } = useI18n()
const localePath = useLocalePath()
const { user, logout } = useAuth()

async function onLogout() {
  await logout()
  await navigateTo(localePath('/login'))
}
</script>

<template>
  <header class="topbar">
    <div class="content bar">
    <NuxtLink class="brand" :to="localePath('/')">{{ t('app.name') }}</NuxtLink>
    <nav class="nav">
      <NuxtLink v-if="user" :to="localePath('/recipes')">{{ t('nav.recipes') }}</NuxtLink>
    </nav>
    <div class="account">
      <template v-if="user">
        <span class="email" :title="t('nav.account', { email: user.email })">{{ user.email }}</span>
        <button class="link" type="button" @click="onLogout">{{ t('nav.logout') }}</button>
      </template>
      <NuxtLink v-else-if="user === null" class="link" :to="localePath('/login')">{{ t('nav.login') }}</NuxtLink>
    </div>
    <label class="lang">
      <span class="visually-hidden">{{ t('app.language') }}</span>
      <select :value="locale" @change="setLocale(($event.target as HTMLSelectElement).value as typeof locale)">
        <option v-for="l in locales" :key="l.code" :value="l.code">{{ l.name }}</option>
      </select>
    </label>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  border-bottom: 1px solid var(--color-border);
}

.bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 3.5rem;
  font-size: 0.9375rem;
}

.brand {
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: -0.01em;
  color: inherit;
  text-decoration: none;
}

.nav {
  flex: 1;
}

.nav a {
  color: var(--color-muted);
  text-decoration: none;
}

.nav a:hover,
.nav a.router-link-active {
  color: var(--color-text);
}

.account {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.email {
  overflow: hidden;
  max-width: 14rem;
  color: var(--color-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
}

.link:hover {
  color: var(--color-muted);
}

.lang select {
  padding: 0.25rem 0.25rem;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-muted);
  font: inherit;
  cursor: pointer;
}

.lang select:hover {
  color: var(--color-text);
}

@media (max-width: 560px) {
  .bar {
    gap: 1rem;
  }

  .email {
    display: none;
  }
}
</style>
