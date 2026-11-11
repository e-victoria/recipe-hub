<script setup lang="ts">
import type { RecipeSummary } from '~/types'

const props = defineProps<{ recipe: RecipeSummary, eager?: boolean }>()

const { t } = useI18n()
const localePath = useLocalePath()

const meta = computed(() => recipeMeta(props.recipe))
</script>

<template>
  <!-- A recipe may only exist in another language, so the card declares its own. -->
  <article class="card" :lang="recipe.locale">
    <!-- Decorative: the title below names the recipe. -->
    <img
      v-if="recipe.cover"
      class="media"
      :src="recipe.cover.url"
      alt=""
      :width="recipe.cover.width ?? undefined"
      :height="recipe.cover.height ?? undefined"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
    >
    <div v-else class="media placeholder" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="32" cy="32" r="15" />
        <circle cx="32" cy="32" r="8.5" />
        <path d="M9 14v9a4 4 0 0 0 8 0v-9M13 14v36" />
        <path d="M55 50V14c-4 3-6 9-6 16v4h6" />
      </svg>
    </div>

    <div class="body">
      <h2>
        <NuxtLink class="link" :to="localePath(`/recipes/${recipe.slug}`)">{{ recipe.title }}</NuxtLink>
      </h2>
      <p v-if="recipe.description" class="description">{{ recipe.description }}</p>
      <ul v-if="meta.length" class="meta">
        <li v-for="item in meta" :key="item.key">{{ t(item.key, { value: item.value }) }}</li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.media {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-large);
  object-fit: cover;
  background: var(--color-subtle);
  transition: opacity 0.15s ease;
}

.card:hover .media {
  opacity: 0.88;
}

.placeholder {
  display: grid;
  place-items: center;
  color: #c4c4c0;
}

.placeholder svg {
  width: 26%;
  max-width: 4.5rem;
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.8rem 0.125rem 0;
}

h2 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.35;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}

.link {
  color: inherit;
  text-decoration: none;
}

/* Stretches the link over the card, so the whole card is clickable. */
.link::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-large);
}

.link:focus-visible {
  outline: none;
}

.link:focus-visible::after {
  outline: 2px solid var(--color-text);
  outline-offset: 3px;
}

.description {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--color-muted);
  font-size: 0.9375rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  margin: 0.2rem 0 0;
  padding: 0;
  list-style: none;
  color: var(--color-muted);
  font-size: 0.8125rem;
}

.meta li + li::before {
  content: '·';
  margin: 0 0.4rem;
}
</style>
