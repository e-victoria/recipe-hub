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
    >
    <div v-else class="media placeholder" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  box-shadow: 0 16px 32px -20px rgb(43 33 24 / 45%);
}

.media {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: color-mix(in srgb, var(--color-accent) 10%, var(--color-surface));
}

.placeholder {
  display: grid;
  place-items: center;
  color: color-mix(in srgb, var(--color-accent) 55%, var(--color-surface));
}

.placeholder svg {
  width: 34%;
  max-width: 6rem;
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1rem 1.15rem 1.15rem;
}

h2 {
  margin: 0 0 0.35rem;
  font-size: 1.125rem;
  line-height: 1.3;
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
  border-radius: inherit;
}

.link:focus-visible {
  outline: none;
}

.link:focus-visible::after {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.description {
  display: -webkit-box;
  margin: 0 0 0.9rem;
  overflow: hidden;
  color: var(--color-muted);
  line-height: 1.45;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: auto 0 0;
  padding: 0;
  list-style: none;
  color: var(--color-muted);
  font-size: 0.8125rem;
}

.meta li {
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }

  .card:hover {
    transform: none;
  }
}
</style>
