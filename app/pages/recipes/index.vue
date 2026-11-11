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
      <h1 class="page-title">{{ t('recipes.title') }}</h1>
      <NuxtLink class="button" :to="localePath('/recipes/new')">{{ t('recipes.add') }}</NuxtLink>
    </header>

    <div v-if="error" class="state" role="alert">
      <p class="state-title">{{ t('recipes.error.title') }}</p>
      <p class="state-hint">{{ t('recipes.error.hint') }}</p>
      <button class="button secondary" type="button" :disabled="status === 'pending'" @click="refresh()">
        {{ t('recipes.error.retry') }}
      </button>
    </div>

    <ul v-else-if="recipes?.length" class="list">
      <!-- The first row is likely on screen at once, so it loads without waiting. -->
      <li v-for="(recipe, index) in recipes" :key="recipe.id">
        <RecipeCard :recipe="recipe" :eager="index < 3" />
      </li>
    </ul>

    <div v-else class="state">
      <p class="state-title">{{ t('recipes.empty.title') }}</p>
      <p class="state-hint">{{ t('recipes.empty.hint') }}</p>
    </div>
  </section>
</template>

<style scoped>
.recipes {
  padding: 2.5rem 0 4rem;
}

.recipes-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 2.25rem 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
