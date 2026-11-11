<script setup lang="ts">
import type { RecipeDetail } from '~/types'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const route = useRoute()

const slug = encodeURIComponent(String(route.params.slug))
const { data: recipe, error, status, refresh } = await useFetch<RecipeDetail>(`/recipes/${slug}`, {
  baseURL: config.public.apiBase,
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

function onUploaded() {
  mediaFailed.value = false
  refresh()
}
</script>

<template>
  <section class="recipe-page">
    <NuxtLink class="back" :to="localePath('/recipes')">← {{ t('recipe.back') }}</NuxtLink>

    <p v-if="recipe && mediaFailed" class="notice" role="alert">{{ t('recipe.mediaFailed') }}</p>

    <div v-if="notFound" class="message">
      <h1 class="message-title">{{ t('recipe.notFound.title') }}</h1>
      <p class="message-hint">{{ t('recipe.notFound.hint') }}</p>
    </div>

    <div v-else-if="error || !recipe" class="message" role="alert">
      <h1 class="message-title">{{ t('recipe.error.title') }}</h1>
      <p class="message-hint">{{ t('recipes.error.hint') }}</p>
      <button class="retry" type="button" :disabled="status === 'pending'" @click="refresh()">
        {{ t('recipes.error.retry') }}
      </button>
    </div>

    <!-- A recipe may only exist in another language, so it declares its own. -->
    <template v-else>
      <article :lang="recipe.locale">
        <h1>{{ recipe.title }}</h1>
        <p v-if="recipe.description" class="description">{{ recipe.description }}</p>
        <ul v-if="recipeMeta(recipe).length" class="meta">
          <li v-for="item in recipeMeta(recipe)" :key="item.key">
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
  padding: 2rem 0;
}

.back {
  color: var(--color-muted);
  text-decoration: none;
}

h1 {
  margin: 1rem 0 0.5rem;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  overflow-wrap: anywhere;
}

h2 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
}

article > section {
  margin-top: 2rem;
}

.description {
  margin: 0 0 0.75rem;
  color: var(--color-muted);
  overflow-wrap: anywhere;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--color-muted);
  font-size: 0.875rem;
}

.cover {
  display: block;
  width: 100%;
  height: auto;
  max-height: 28rem;
  margin-top: 1.5rem;
  border-radius: 12px;
  object-fit: cover;
}

.body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.ingredients ul,
.steps ol {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding-left: 1.25rem;
  overflow-wrap: anywhere;
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
  border-radius: 12px;
  object-fit: cover;
  aspect-ratio: 4 / 3;
}

.videos {
  display: grid;
  gap: 1rem;
}

.videos video {
  display: block;
  width: 100%;
  max-height: 32rem;
  border-radius: 12px;
  background: #000;
}

.notice {
  margin: 1rem 0 0;
  padding: 0.75rem 1rem;
  border: 1px solid #b3261e;
  border-radius: 8px;
}

.message {
  margin-top: 1rem;
  padding: 3rem 1rem;
  border: 1px dashed var(--color-border);
  border-radius: 12px;
  text-align: center;
}

.message-title {
  margin: 0 0 0.25rem;
  font-size: 1.125rem;
}

.message-hint {
  margin: 0;
  color: var(--color-muted);
}

.retry {
  margin-top: 1rem;
  padding: 0.6rem 1.1rem;
  border: 0;
  border-radius: 8px;
  background: var(--color-text);
  color: var(--color-bg);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
</style>
