<script setup lang="ts">
import type { Locale, Recipe } from '~/types'

const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
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

const localeOptions = computed(() =>
  locales.value.map((item) => ({ code: item.code as Locale, name: item.name ?? item.code })),
)

async function submit() {
  submitting.value = true
  errorKey.value = null
  try {
    await $fetch<Recipe>('/recipes', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: buildRecipePayload(form),
    })
    await navigateTo(localePath('/recipes'))
  } catch (error) {
    errorKey.value = (error as { statusCode?: number }).statusCode === 422
      ? 'recipeNew.error.invalid'
      : 'recipeNew.error.generic'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="recipe-new">
    <NuxtLink class="back" :to="localePath('/recipes')">← {{ t('recipeNew.back') }}</NuxtLink>
    <h1>{{ t('recipeNew.title') }}</h1>

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

      <p v-if="errorKey" class="error" role="alert">{{ t(errorKey) }}</p>

      <div class="actions">
        <button class="button" type="submit" :disabled="submitting">
          {{ submitting ? t('recipeNew.saving') : t('recipeNew.save') }}
        </button>
        <NuxtLink class="cancel" :to="localePath('/recipes')">{{ t('recipeNew.cancel') }}</NuxtLink>
      </div>
    </form>
  </section>
</template>

<style scoped>
.recipe-new {
  padding: 2rem 0;
}

.back {
  color: var(--color-muted);
  text-decoration: none;
}

.recipe-new h1 {
  margin: 1rem 0 1.5rem;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
}

.form {
  display: grid;
  gap: 1.25rem;
  max-width: 640px;
}

.field {
  display: grid;
  gap: 0.35rem;
  font-weight: 600;
}

.field small {
  font-weight: 400;
  color: var(--color-muted);
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font: inherit;
  font-weight: 400;
  background: transparent;
  color: inherit;
}

.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.error {
  margin: 0;
  color: #b3261e;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.button {
  padding: 0.6rem 1.1rem;
  border: 0;
  border-radius: 8px;
  background: var(--color-text);
  color: var(--color-bg);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.button:disabled {
  opacity: 0.6;
  cursor: progress;
}

.cancel {
  color: var(--color-muted);
}
</style>
