import type { RecipeSummary } from '~/types'

export interface RecipeMetaItem {
  key: string
  value: number
}

// The facts shown on a recipe card, as translation keys. Unset values are left out.
export function recipeMeta(
  recipe: Pick<RecipeSummary, 'servings' | 'prep_minutes' | 'cook_minutes'>,
): RecipeMetaItem[] {
  const items = [
    { key: 'recipes.meta.servings', value: recipe.servings },
    { key: 'recipes.meta.prep', value: recipe.prep_minutes },
    { key: 'recipes.meta.cook', value: recipe.cook_minutes },
  ]
  return items.filter((item): item is RecipeMetaItem => item.value !== null)
}
