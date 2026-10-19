<script setup lang="ts">
const { locale, locales, setLocale, t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <header class="topbar">
    <NuxtLink class="brand" :to="localePath('/')">{{ t('app.name') }}</NuxtLink>
    <nav class="nav">
      <NuxtLink :to="localePath('/recipes')">{{ t('nav.recipes') }}</NuxtLink>
    </nav>
    <label class="lang">
      <span class="visually-hidden">{{ t('app.language') }}</span>
      <select :value="locale" @change="setLocale(($event.target as HTMLSelectElement).value as typeof locale)">
        <option v-for="l in locales" :key="l.code" :value="l.code">{{ l.name }}</option>
      </select>
    </label>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.brand {
  font-weight: 700;
  font-size: 1.125rem;
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

.nav a.router-link-active {
  color: inherit;
  font-weight: 600;
}

.lang select {
  font: inherit;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: inherit;
}
</style>
