import { describe, expect, it } from 'vitest'
import { recipeMeta } from '../app/utils/recipeList'

describe('recipeMeta', () => {
  it('lists servings, prep and cook time in that order', () => {
    expect(recipeMeta({ servings: 4, prep_minutes: 15, cook_minutes: 30 })).toEqual([
      { key: 'recipes.meta.servings', value: 4 },
      { key: 'recipes.meta.prep', value: 15 },
      { key: 'recipes.meta.cook', value: 30 },
    ])
  })

  it('leaves out values the recipe does not have', () => {
    expect(recipeMeta({ servings: null, prep_minutes: 15, cook_minutes: null })).toEqual([
      { key: 'recipes.meta.prep', value: 15 },
    ])
  })

  it('keeps a time of zero, which the API allows', () => {
    expect(recipeMeta({ servings: null, prep_minutes: null, cook_minutes: 0 })).toEqual([
      { key: 'recipes.meta.cook', value: 0 },
    ])
  })

  it('is empty when nothing is set', () => {
    expect(recipeMeta({ servings: null, prep_minutes: null, cook_minutes: null })).toEqual([])
  })
})
