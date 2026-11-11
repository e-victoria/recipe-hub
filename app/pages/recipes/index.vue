<script setup lang="ts">
import type { RecipeSummary } from '~/types'

const { t, locale } = useI18n()
const localePath = useLocalePath()
useHead({ title: () => `${t('recipes.title')} · ${t('app.name')}` })

const { data: recipes, error, status, refresh } = await useFetch<RecipeSummary[]>('/recipes', {
  baseURL: '/api',
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
      <!-- The first row is likely on screen at once, so it loads without waiting. -->
      <li v-for="(recipe, index) in recipes" :key="recipe.id">
        <RecipeCard :recipe="recipe" :eager="index < 3" />
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
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-weight: 600;
  text-decoration: none;
}

.button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

.button:hover {
  opacity: 0.9;
}

.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.empty {
  padding: 3rem 1rem;
  border: 1px dashed var(--color-border);
  border-radius: 18px;
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
