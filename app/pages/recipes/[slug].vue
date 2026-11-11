<script setup lang="ts">
import type { RecipeDetail } from '~/types'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const slug = encodeURIComponent(String(route.params.slug))
const { data: recipe, error, status, refresh } = await useFetch<RecipeDetail>(`/recipes/${slug}`, {
  baseURL: '/api',
  query: { locale },
})

// Set after the new recipe form could not upload everything; gone once a later upload works.
const mediaFailed = ref(Boolean(route.query.mediaFailed))

const notFound = computed(() => error.value?.statusCode === 404)
if (notFound.value) {
  setResponseStatus(useRequestEvent(), 404)
}

useHead({ title: () => `${recipe.value?.title ?? t('recipes.title')} · ${t('app.name')}` })

const cover = computed(() => recipe.value?.images[0])
const moreImages = computed(() => recipe.value?.images.slice(1) ?? [])
const meta = computed(() => (recipe.value ? recipeMeta(recipe.value) : []))

function onUploaded() {
  mediaFailed.value = false
  refresh()
}
</script>

<template>
  <section class="recipe-page">
    <NuxtLink class="back" :to="localePath('/recipes')">← {{ t('recipe.back') }}</NuxtLink>

    <p v-if="recipe && mediaFailed" class="notice" role="alert">{{ t('recipe.mediaFailed') }}</p>

    <div v-if="notFound" class="state">
      <h1 class="state-title">{{ t('recipe.notFound.title') }}</h1>
      <p class="state-hint">{{ t('recipe.notFound.hint') }}</p>
    </div>

    <div v-else-if="error || !recipe" class="state" role="alert">
      <h1 class="state-title">{{ t('recipe.error.title') }}</h1>
      <p class="state-hint">{{ t('recipes.error.hint') }}</p>
      <button class="button secondary" type="button" :disabled="status === 'pending'" @click="refresh()">
        {{ t('recipes.error.retry') }}
      </button>
    </div>

    <!-- A recipe may only exist in another language, so it declares its own. -->
    <template v-else>
      <article :lang="recipe.locale">
        <h1 class="page-title">{{ recipe.title }}</h1>
        <p v-if="recipe.description" class="description">{{ recipe.description }}</p>
        <ul v-if="meta.length" class="meta">
          <li v-for="item in meta" :key="item.key">
            {{ t(item.key, { value: item.value }) }}
          </li>
        </ul>

        <img
          v-if="cover"
          class="cover"
          :src="cover.url"
          :alt="t('recipe.imageAlt', { title: recipe.title, number: 1 })"
          :width="cover.width ?? undefined"
          :height="cover.height ?? undefined"
          fetchpriority="high"
          decoding="async"
        />

        <div class="body">
          <section v-if="recipe.ingredients.length" class="ingredients">
            <h2>{{ t('recipe.ingredients') }}</h2>
            <ul>
              <li v-for="(ingredient, index) in recipe.ingredients" :key="index">{{ ingredient }}</li>
            </ul>
          </section>

          <section v-if="recipe.steps.length" class="steps">
            <h2>{{ t('recipe.steps') }}</h2>
            <ol>
              <li v-for="(step, index) in recipe.steps" :key="index">{{ step }}</li>
            </ol>
          </section>
        </div>

        <section v-if="moreImages.length">
          <h2>{{ t('recipe.photos') }}</h2>
          <ul class="gallery">
            <li v-for="(image, index) in moreImages" :key="image.id">
              <img
                :src="image.url"
                :alt="t('recipe.imageAlt', { title: recipe.title, number: index + 2 })"
                :width="image.width ?? undefined"
                :height="image.height ?? undefined"
                loading="lazy"
                decoding="async"
              />
            </li>
          </ul>
        </section>

        <section v-if="recipe.videos.length">
          <h2>{{ t('recipe.videos') }}</h2>
          <div class="videos">
            <video v-for="video in recipe.videos" :key="video.id" controls playsinline preload="metadata">
              <source :src="video.url" :type="video.content_type" />
            </video>
          </div>
        </section>
      </article>

      <RecipeMediaUpload :slug="recipe.slug" :cover-hint="!recipe.images.length" @uploaded="onUploaded" />
    </template>
  </section>
</template>

<style scoped>
.recipe-page {
  padding: 2rem 0 4rem;
}

.page-title {
  margin: 1.25rem 0 0.5rem;
}

h2 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
}

article > section {
  margin-top: 3rem;
}

.description {
  max-width: 40rem;
  margin: 0 0 0.75rem;
  color: var(--color-muted);
  font-size: 1.0625rem;
  overflow-wrap: anywhere;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--color-muted);
  font-size: 0.875rem;
}

.meta li + li::before {
  content: '·';
  margin: 0 0.5rem;
}

.cover {
  display: block;
  width: 100%;
  height: auto;
  max-height: 30rem;
  margin-top: 1.75rem;
  border-radius: var(--radius-large);
  object-fit: cover;
  background: var(--color-subtle);
}

.body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 2.5rem 3.5rem;
  margin-top: 3rem;
}

.ingredients ul {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-wrap: anywhere;
}

.ingredients li {
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--color-border);
}

.ingredients li:first-child {
  padding-top: 0;
}

.steps ol {
  display: grid;
  gap: 1rem;
  margin: 0;
  padding-left: 1.25rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.steps li::marker {
  color: var(--color-muted);
  font-variant-numeric: tabular-nums;
}

.steps li {
  padding-left: 0.35rem;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.gallery img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
  object-fit: cover;
  aspect-ratio: 4 / 3;
  background: var(--color-subtle);
}

.videos {
  display: grid;
  gap: 1rem;
}

.videos video {
  display: block;
  width: 100%;
  max-height: 32rem;
  border-radius: var(--radius-large);
  background: #000;
}

.notice {
  margin: 1.25rem 0 0;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-danger);
  border-radius: var(--radius);
  color: var(--color-danger);
}

@media (max-width: 700px) {
  .body {
    grid-template-columns: 1fr;
  }
}
</style>
