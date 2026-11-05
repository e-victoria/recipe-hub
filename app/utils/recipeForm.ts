import type { Locale, RecipeCreate } from '~/types'

export interface RecipeFormValues {
  locale: Locale
  title: string
  description: string
  servings: number | string | null
  prepMinutes: number | string | null
  cookMinutes: number | string | null
  // One entry per line.
  ingredients: string
  steps: string
}

export function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

// A cleared number input holds '' (or null), which means "not set" for the API.
function toNumberOrNull(value: number | string | null): number | null {
  if (value === null || value === '') {
    return null
  }
  return Number(value)
}

export function buildRecipePayload(form: RecipeFormValues): RecipeCreate {
  return {
    servings: toNumberOrNull(form.servings),
    prep_minutes: toNumberOrNull(form.prepMinutes),
    cook_minutes: toNumberOrNull(form.cookMinutes),
    translations: [
      {
        locale: form.locale,
        title: form.title.trim(),
        description: form.description.trim() || null,
        ingredients: splitLines(form.ingredients),
        steps: splitLines(form.steps),
      },
    ],
  }
}
