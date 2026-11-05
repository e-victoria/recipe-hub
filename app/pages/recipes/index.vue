<script setup lang="ts">
import type { RecipeSummary } from '~/types'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
useHead({ title: () => `${t('recipes.title')} · ${t('app.name')}` })

const { data: recipes, error, status, refresh } = await useFetch<RecipeSummary[]>('/recipes', {
  baseURL: config.public.apiBase,
  query: { locale },
})
</script>

<template>
  <section class="recipes">
    <header class="recipes-header">
      <h1>{{ t('recipes.title') }}</h1>
      <NuxtLink class="button" :to="localePath('/recipes/new')">{{ t('recipes.add') }}</NuxtLink>
    </header>

    <div v-if="error" class="empty" role="alert">
      <p class="empty-title">{{ t('recipes.error.title') }}</p>
      <p class="empty-hint">{{ t('recipes.error.hint') }}</p>
      <button class="button retry" type="button" :disabled="status === 'pending'" @click="refresh()">
        {{ t('recipes.error.retry') }}
      </button>
    </div>

    <ul v-else-if="recipes?.length" class="list">
      <!-- A recipe may only exist in another language, so the card declares its own. -->
      <li v-for="recipe in recipes" :key="recipe.id" class="card" :lang="recipe.locale">
        <h2>{{ recipe.title }}</h2>
        <p v-if="recipe.description" class="card-description">{{ recipe.description }}</p>
        <ul v-if="recipeMeta(recipe).length" class="card-meta">
          <li v-for="item in recipeMeta(recipe)" :key="item.key">
            {{ t(item.key, { value: item.value }) }}
          </li>
        </ul>
      </li>
    </ul>

    <div v-else class="empty">
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

.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
}

.card h2 {
  margin: 0 0 0.25rem;
  font-size: 1.125rem;
  overflow-wrap: anywhere;
}

.card-description {
  margin: 0 0 0.75rem;
  color: var(--color-muted);
  overflow-wrap: anywhere;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--color-muted);
  font-size: 0.875rem;
}

.empty {
  padding: 3rem 1rem;
  border: 1px dashed var(--color-border);
  border-radius: 12px;
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

.retry {
  margin-top: 1rem;
  border: 0;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
</style>
