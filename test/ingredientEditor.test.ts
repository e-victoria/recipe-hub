import { describe, expect, it } from 'vitest'
import {
  applySuggestion,
  assistantErrorKey,
  isApplicable,
  rowsToIngredients,
  toRows,
  toSuggestions,
  type IngredientRow,
  type Suggestion,
} from '../app/utils/ingredientEditor'

function counter(start = 0) {
  let id = start
  return () => ++id
}

function rows(): IngredientRow[] {
  return [
    { id: 1, text: '500 g flour' },
    { id: 2, text: '2 eggs' },
    { id: 3, text: 'salt' },
  ]
}

function suggestion(overrides: Partial<Suggestion>): Suggestion {
  return { id: 99, action: 'replace', rowId: 2, ingredient: '2 tbsp flaxseed', reason: '', ...overrides }
}

describe('rows', () => {
  it('gives each ingredient its own id', () => {
    expect(toRows(['a', 'b'], counter())).toEqual([{ id: 1, text: 'a' }, { id: 2, text: 'b' }])
  })

  it('trims rows and drops blank ones when saving', () => {
    expect(rowsToIngredients([{ id: 1, text: ' a ' }, { id: 2, text: '  ' }, { id: 3, text: 'b' }]))
      .toEqual(['a', 'b'])
  })
})

describe('toSuggestions', () => {
  it('ties each change to the row at its index in the list that was sent', () => {
    const sent = [{ id: 7, text: 'flour' }, { id: 9, text: 'eggs' }]
    const result = toSuggestions(
      [
        { action: 'replace', index: 1, ingredient: 'flaxseed', reason: 'vegan' },
        { action: 'add', index: 1, ingredient: 'water', reason: 'for the flaxseed' },
        { action: 'add', index: null, ingredient: 'pepper', reason: '' },
        { action: 'remove', index: 0, ingredient: null, reason: 'not needed' },
      ],
      sent,
      counter(100),
    )
    expect(result).toEqual([
      { id: 101, action: 'replace', rowId: 9, ingredient: 'flaxseed', reason: 'vegan' },
      { id: 102, action: 'add', rowId: 9, ingredient: 'water', reason: 'for the flaxseed' },
      { id: 103, action: 'add', rowId: null, ingredient: 'pepper', reason: '' },
      { id: 104, action: 'remove', rowId: 7, ingredient: '', reason: 'not needed' },
    ])
  })

  it('drops changes that point at no row', () => {
    const result = toSuggestions(
      [
        { action: 'replace', index: 5, ingredient: 'x', reason: '' },
        { action: 'remove', index: null, ingredient: null, reason: '' },
        { action: 'add', index: 5, ingredient: 'x', reason: '' },
      ],
      [{ id: 1, text: 'flour' }],
      counter(),
    )
    expect(result).toEqual([])
  })
})

describe('applySuggestion', () => {
  it('replaces the text and keeps the row id', () => {
    expect(applySuggestion(rows(), suggestion({}), counter(10))[1]).toEqual({ id: 2, text: '2 tbsp flaxseed' })
  })

  it('removes the row', () => {
    const result = applySuggestion(rows(), suggestion({ action: 'remove', ingredient: '' }), counter(10))
    expect(result.map((row) => row.id)).toEqual([1, 3])
  })

  it('adds after the row it names', () => {
    const result = applySuggestion(rows(), suggestion({ action: 'add', ingredient: 'water' }), counter(10))
    expect(result.map((row) => row.text)).toEqual(['500 g flour', '2 eggs', 'water', 'salt'])
    expect(result[2]?.id).toBe(11)
  })

  it('adds at the end without a row, or when the row is gone', () => {
    const atEnd = applySuggestion(rows(), suggestion({ action: 'add', rowId: null, ingredient: 'water' }), counter(10))
    const orphan = applySuggestion(rows(), suggestion({ action: 'add', rowId: 42, ingredient: 'water' }), counter(10))
    expect(atEnd.at(-1)?.text).toBe('water')
    expect(orphan.at(-1)?.text).toBe('water')
  })

  it('follows the row after the list is reordered by earlier edits', () => {
    const edited = [{ id: 8, text: 'sugar' }, ...rows().filter((row) => row.id !== 1)]
    const result = applySuggestion(edited, suggestion({}), counter(10))
    expect(result.map((row) => row.text)).toEqual(['sugar', '2 tbsp flaxseed', 'salt'])
  })

  it('leaves the list alone when the row to replace or remove is gone', () => {
    const before = rows()
    expect(applySuggestion(before, suggestion({ rowId: 42 }), counter(10))).toBe(before)
    expect(applySuggestion(before, suggestion({ action: 'remove', rowId: 42 }), counter(10))).toBe(before)
  })

  it('does not change the list it was given', () => {
    const before = rows()
    applySuggestion(before, suggestion({}), counter(10))
    applySuggestion(before, suggestion({ action: 'add' }), counter(10))
    expect(before).toEqual(rows())
  })
})

describe('isApplicable', () => {
  it('needs the row for replace and remove, but not for add', () => {
    expect(isApplicable(suggestion({}), rows())).toBe(true)
    expect(isApplicable(suggestion({ rowId: 42 }), rows())).toBe(false)
    expect(isApplicable(suggestion({ action: 'remove', rowId: 42 }), rows())).toBe(false)
    expect(isApplicable(suggestion({ action: 'add', rowId: 42 }), rows())).toBe(true)
  })
})

describe('assistantErrorKey', () => {
  it('tells rate limits and a switched-off assistant apart from other failures', () => {
    expect(assistantErrorKey(429)).toBe('ingredients.ai.error.tooMany')
    expect(assistantErrorKey(503)).toBe('ingredients.ai.error.unavailable')
    expect(assistantErrorKey(502)).toBe('ingredients.ai.error.generic')
    expect(assistantErrorKey(undefined)).toBe('ingredients.ai.error.generic')
  })
})
