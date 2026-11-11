import type { IngredientChange } from '~/types'

// One line of the editor. The id stays with the line while others are added, removed or reordered.
export interface IngredientRow {
  id: number
  text: string
}

// A change proposed by the assistant, tied to the row it was proposed for rather than to a
// position, so it still lands in the right place after the user edits the list.
export interface Suggestion {
  id: number
  action: IngredientChange['action']
  // The row to replace or remove, or the row to add after. Null adds at the end.
  rowId: number | null
  ingredient: string
  reason: string
}

export function toRows(ingredients: string[], nextId: () => number): IngredientRow[] {
  return ingredients.map((text) => ({ id: nextId(), text }))
}

export function rowsToIngredients(rows: IngredientRow[]): string[] {
  return rows.map((row) => row.text.trim()).filter(Boolean)
}

// `sent` are the rows whose text went to the assistant, in the order sent: a change's index
// points into that list.
export function toSuggestions(
  changes: IngredientChange[],
  sent: IngredientRow[],
  nextId: () => number,
): Suggestion[] {
  return changes.flatMap((change) => {
    const row = change.index === null ? undefined : sent[change.index]
    if (change.index !== null && !row) {
      return []
    }
    if (change.action !== 'add' && !row) {
      return []
    }
    return [{
      id: nextId(),
      action: change.action,
      rowId: row?.id ?? null,
      ingredient: change.ingredient ?? '',
      reason: change.reason,
    }]
  })
}

// Whether the suggestion can still be applied: a row that was replaced or removed takes its
// replace/remove suggestions with it. An add whose anchor is gone falls back to the end.
export function isApplicable(suggestion: Suggestion, rows: IngredientRow[]): boolean {
  return suggestion.action === 'add' || rows.some((row) => row.id === suggestion.rowId)
}

export function applySuggestion(
  rows: IngredientRow[],
  suggestion: Suggestion,
  nextId: () => number,
): IngredientRow[] {
  const index = rows.findIndex((row) => row.id === suggestion.rowId)
  if (suggestion.action === 'add') {
    const added = { id: nextId(), text: suggestion.ingredient }
    return index === -1
      ? [...rows, added]
      : [...rows.slice(0, index + 1), added, ...rows.slice(index + 1)]
  }
  if (index === -1) {
    return rows
  }
  if (suggestion.action === 'remove') {
    return rows.filter((row) => row.id !== suggestion.rowId)
  }
  // Keeps the row's id, so an "add after this line" suggestion still finds it.
  return rows.map((row) => (row.id === suggestion.rowId ? { ...row, text: suggestion.ingredient } : row))
}

// The translation key for a failed assistant request.
export function assistantErrorKey(statusCode: number | undefined): string {
  if (statusCode === 429) {
    return 'ingredients.ai.error.tooMany'
  }
  if (statusCode === 503) {
    return 'ingredients.ai.error.unavailable'
  }
  return 'ingredients.ai.error.generic'
}
