<script setup lang="ts">
import type { Locale, Recipe } from '~/types'

const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
useHead({ title: () => `${t('recipeNew.title')} · ${t('app.name')}` })

const form = reactive<RecipeFormValues>({
  locale: locale.value,
  title: '',
  description: '',
  servings: null,
  prepMinutes: null,
  cookMinutes: null,
  ingredients: '',
  steps: '',
})
const submitting = ref(false)
const errorKey = ref<string | null>(null)
const files = ref<File[]>([])
const uploading = ref<number | null>(null)
const mediaApi = useMediaApi()

const localeOptions = computed(() =>
  locales.value.map((item) => ({ code: item.code as Locale, name: item.name ?? item.code })),
)

async function submit() {
  submitting.value = true
  errorKey.value = null
  try {
    const recipe = await $fetch<Recipe>('/recipes', {
      baseURL: '/api',
      method: 'POST',
      body: buildRecipePayload(form),
    })
    const failed = await uploadMedia(files.value, mediaApi(recipe.slug), (current) => {
      uploading.value = current
    })
    // The recipe exists by now, so saving again would duplicate it: show it with a notice instead.
    await navigateTo(failed.length
      ? localePath({ path: `/recipes/${recipe.slug}`, query: { mediaFailed: '1' } })
      : localePath('/recipes'))
  } catch (error) {
    errorKey.value = (error as { statusCode?: number }).statusCode === 422
      ? 'recipeNew.error.invalid'
      : 'recipeNew.error.generic'
  } finally {
    submitting.value = false
    uploading.value = null
  }
}
</script>

<template>
  <section class="recipe-new">
    <NuxtLink class="back" :to="localePath('/recipes')">← {{ t('recipeNew.back') }}</NuxtLink>
    <h1 class="page-title">{{ t('recipeNew.title') }}</h1>

    <form class="form" @submit.prevent="submit">
      <label class="field">
        <span>{{ t('recipeNew.fields.language') }}</span>
        <select v-model="form.locale">
          <option v-for="option in localeOptions" :key="option.code" :value="option.code">
            {{ option.name }}
          </option>
        </select>
        <small>{{ t('recipeNew.hints.language') }}</small>
      </label>

      <label class="field">
        <span>{{ t('recipeNew.fields.title') }}</span>
        <input v-model="form.title" type="text" required maxlength="300" />
      </label>

      <label class="field">
        <span>{{ t('recipeNew.fields.description') }}</span>
        <textarea v-model="form.description" rows="3" />
      </label>

      <div class="row">
        <label class="field">
          <span>{{ t('recipeNew.fields.servings') }}</span>
          <input v-model.number="form.servings" type="number" min="1" step="1" />
        </label>
        <label class="field">
          <span>{{ t('recipeNew.fields.prepMinutes') }}</span>
          <input v-model.number="form.prepMinutes" type="number" min="0" step="1" />
        </label>
        <label class="field">
          <span>{{ t('recipeNew.fields.cookMinutes') }}</span>
          <input v-model.number="form.cookMinutes" type="number" min="0" step="1" />
        </label>
      </div>

      <label class="field">
        <span>{{ t('recipeNew.fields.ingredients') }}</span>
        <textarea v-model="form.ingredients" rows="6" />
        <small>{{ t('recipeNew.hints.onePerLine') }}</small>
      </label>

      <label class="field">
        <span>{{ t('recipeNew.fields.steps') }}</span>
        <textarea v-model="form.steps" rows="8" />
        <small>{{ t('recipeNew.hints.onePerLine') }}</small>
      </label>

      <MediaPicker v-model="files" :disabled="submitting" cover-hint />

      <p v-if="errorKey" class="error" role="alert">{{ t(errorKey) }}</p>

      <div class="actions">
        <button class="button" type="submit" :disabled="submitting">
          <template v-if="uploading">
            {{ t('media.uploading', { current: uploading, total: files.length }) }}
          </template>
          <template v-else>{{ submitting ? t('recipeNew.saving') : t('recipeNew.save') }}</template>
        </button>
        <NuxtLink class="cancel" :to="localePath('/recipes')">{{ t('recipeNew.cancel') }}</NuxtLink>
      </div>
    </form>
  </section>
</template>

<style scoped>
.recipe-new {
  max-width: 36rem;
  padding: 2rem 0 4rem;
}

.page-title {
  margin: 1.25rem 0 2rem;
}

.form {
  display: grid;
  gap: 1.5rem;
}

.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 1rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.cancel {
  color: var(--color-muted);
  text-decoration: none;
}

.cancel:hover {
  color: var(--color-text);
}
</style>
