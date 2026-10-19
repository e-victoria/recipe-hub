<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
useHead({ title: () => `${t('recipes.title')} · ${t('app.name')}` })
</script>

<template>
  <section class="recipes">
    <header class="recipes-header">
      <h1>{{ t('recipes.title') }}</h1>
      <NuxtLink class="button" :to="localePath('/recipes/new')">{{ t('recipes.add') }}</NuxtLink>
    </header>

    <!-- The list renders here once recipe-hub-api exposes a recipes endpoint and its generated types. -->
    <div class="empty">
      <p class="empty-title">{{ t('recipes.empty.title') }}</p>
      <p class="empty-hint">{{ t('recipes.empty.hint') }}</p>
    </div>
  </section>
</template>

<style scoped>
.recipes {
  padding: 2rem 0;
}

.recipes-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.recipes-header h1 {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
}

.button {
  display: inline-block;
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  background: var(--color-text);
  color: var(--color-bg);
  font-weight: 600;
  text-decoration: none;
}

.button:hover {
  opacity: 0.9;
}

.empty {
  padding: 3rem 1rem;
  border: 1px dashed var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  text-align: center;
}

.empty-title {
  margin: 0 0 0.25rem;
  font-weight: 600;
  font-size: 1.125rem;
}

.empty-hint {
  margin: 0;
  color: var(--color-muted);
}
</style>
