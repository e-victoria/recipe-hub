import type { components } from './api'

// Short names for the generated API types; the shapes come from recipe-hub-api's OpenAPI spec.
export type Locale = components['schemas']['Locale']
export type RecipeCreate = components['schemas']['RecipeCreate']
export type Recipe = components['schemas']['Recipe']
export type RecipeSummary = components['schemas']['RecipeSummary']
