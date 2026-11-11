import type { components } from './api'

// Short names for the generated API types; the shapes come from recipe-hub-api's OpenAPI spec.
export type Locale = components['schemas']['Locale']
export type RecipeCreate = components['schemas']['RecipeCreate']
export type Recipe = components['schemas']['Recipe']
export type RecipeDetail = components['schemas']['RecipeDetail']
export type RecipeSummary = components['schemas']['RecipeSummary']
export type IngredientsUpdate = components['schemas']['IngredientsUpdate']
export type IngredientAdviceRequest = components['schemas']['IngredientAdviceRequest']
export type IngredientAdvice = components['schemas']['IngredientAdvice']
export type IngredientChange = components['schemas']['IngredientChange']
export type ImageCreate = components['schemas']['ImageCreate']
export type MediaUpload = components['schemas']['MediaUpload']
export type User = components['schemas']['User']
export type LoginRequest = components['schemas']['LoginRequest']
export type RegisterRequest = components['schemas']['RegisterRequest']
