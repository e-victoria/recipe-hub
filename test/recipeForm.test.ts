import { describe, expect, it } from 'vitest'
import { buildRecipePayload, splitLines, type RecipeFormValues } from '../app/utils/recipeForm'

function form(overrides: Partial<RecipeFormValues> = {}): RecipeFormValues {
  return {
    locale: 'en',
    title: '  Dumplings ',
    description: '',
    servings: 4,
    prepMinutes: '',
    cookMinutes: null,
    ingredients: '500 g flour\n\n  2 eggs  \n',
    steps: 'Mix\nBoil',
    ...overrides,
  }
}

describe('splitLines', () => {
  it('trims lines and drops blank ones', () => {
    expect(splitLines(' a \n\n  \nb')).toEqual(['a', 'b'])
  })

  it('returns an empty list for empty text', () => {
    expect(splitLines('')).toEqual([])
  })
})

describe('buildRecipePayload', () => {
  it('builds one translation in the chosen locale', () => {
    expect(buildRecipePayload(form({ locale: 'pl' }))).toEqual({
      servings: 4,
      prep_minutes: null,
      cook_minutes: null,
      translations: [
        {
          locale: 'pl',
          title: 'Dumplings',
          description: null,
          ingredients: ['500 g flour', '2 eggs'],
          steps: ['Mix', 'Boil'],
        },
      ],
    })
  })

  it('keeps a description and turns numeric strings into numbers', () => {
    const payload = buildRecipePayload(form({ description: ' Soft. ', prepMinutes: '20', cookMinutes: '0' }))
    expect(payload.translations[0]?.description).toBe('Soft.')
    expect(payload.prep_minutes).toBe(20)
    expect(payload.cook_minutes).toBe(0)
  })
})
