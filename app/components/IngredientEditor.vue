<script setup lang="ts">
import type { IngredientAdvice, IngredientAdviceRequest, IngredientsUpdate, Locale } from '~/types'

const props = defineProps<{
  slug: string
  // The language the recipe text is in, which may differ from the app's.
  recipeLocale: Locale
  title: string
  servings: number | null
  ingredients: string[]
  steps: string[]
}>()
const emit = defineEmits<{ saved: [], cancel: [] }>()

const { t, locale } = useI18n()

let lastId = 0
const nextId = () => ++lastId

const rows = ref<IngredientRow[]>(toRows(props.ingredients, nextId))
const list = useTemplateRef<HTMLUListElement>('list')
const saving = ref(false)
const saveFailed = ref(false)

const question = ref('')
const asking = ref(false)
const askErrorKey = ref<string | null>(null)
const reply = ref<string | null>(null)
const suggestions = ref<Suggestion[]>([])

const exampleKeys = ['vegan', 'glutenFree', 'double'].map((name) => `ingredients.ai.examples.${name}`)

// Suggestions for rows the user has since removed are no longer shown.
const openSuggestions = computed(() => suggestions.value.filter((item) => isApplicable(item, rows.value)))

function rowText(rowId: number | null) {
  return rows.value.find((row) => row.id === rowId)?.text ?? ''
}

async function addRow(afterIndex = rows.value.length - 1) {
  const row = { id: nextId(), text: '' }
  rows.value.splice(afterIndex + 1, 0, row)
  await nextTick()
  list.value?.querySelector<HTMLInputElement>(`[data-row="${row.id}"]`)?.focus()
}

function removeRow(id: number) {
  rows.value = rows.value.filter((row) => row.id !== id)
}

async function ask(text = question.value) {
  const request = text.trim()
  if (!request || asking.value) {
    return
  }
  question.value = request
  asking.value = true
  askErrorKey.value = null
  // Blank rows are not sent, so the answer's positions refer to this list.
  const sent = rows.value.filter((row) => row.text.trim())
  try {
    const advice = await $fetch<IngredientAdvice>('/assistant/ingredients', {
      baseURL: '/api',
      method: 'POST',
      body: {
        locale: props.recipeLocale,
        reply_locale: locale.value,
        title: props.title,
        servings: props.servings,
        ingredients: sent.map((row) => row.text),
        steps: props.steps,
        request,
      } satisfies IngredientAdviceRequest,
    })
    reply.value = advice.reply
    suggestions.value = toSuggestions(advice.changes, sent, nextId)
  } catch (error) {
    askErrorKey.value = assistantErrorKey((error as { statusCode?: number }).statusCode)
  } finally {
    asking.value = false
  }
}

function dismiss(suggestion: Suggestion) {
  suggestions.value = suggestions.value.filter((item) => item.id !== suggestion.id)
}

function apply(suggestion: Suggestion) {
  rows.value = applySuggestion(rows.value, suggestion, nextId)
  dismiss(suggestion)
}

function applyAll() {
  for (const suggestion of openSuggestions.value) {
    apply(suggestion)
  }
}

async function save() {
  saving.value = true
  saveFailed.value = false
  try {
    await $fetch(`/recipes/${encodeURIComponent(props.slug)}/ingredients`, {
      baseURL: '/api',
      method: 'PUT',
      body: {
        locale: props.recipeLocale,
        ingredients: rowsToIngredients(rows.value),
      } satisfies IngredientsUpdate,
    })
    emit('saved')
  } catch {
    saveFailed.value = true
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="editor" @submit.prevent="save">
    <div class="columns">
      <div class="rows">
        <ul ref="list" :lang="recipeLocale">
          <li v-for="(row, index) in rows" :key="row.id">
            <input
              v-model="row.text"
              type="text"
              maxlength="2000"
              :data-row="row.id"
              :aria-label="t('ingredients.item', { number: index + 1 })"
              :placeholder="t('ingredients.placeholder')"
              @keydown.enter.prevent="addRow(index)"
            />
            <button
              class="remove"
              type="button"
              :aria-label="t('ingredients.remove', { name: row.text || t('ingredients.item', { number: index + 1 }) })"
              @click="removeRow(row.id)"
            >
              ×
            </button>
          </li>
        </ul>
        <button class="button secondary small" type="button" @click="addRow()">
          {{ t('ingredients.add') }}
        </button>
      </div>

      <section class="assistant" :aria-label="t('ingredients.ai.title')">
        <h3>{{ t('ingredients.ai.title') }}</h3>
        <p class="hint">{{ t('ingredients.ai.hint') }}</p>
        <div class="ask">
          <input
            v-model="question"
            type="text"
            maxlength="500"
            :aria-label="t('ingredients.ai.title')"
            :placeholder="t('ingredients.ai.placeholder')"
            :disabled="asking"
            @keydown.enter.prevent="ask()"
          />
          <button class="button small" type="button" :disabled="asking || !question.trim()" @click="ask()">
            {{ asking ? t('ingredients.ai.asking') : t('ingredients.ai.ask') }}
          </button>
        </div>
        <ul class="examples">
          <li v-for="key in exampleKeys" :key="key">
            <button type="button" :disabled="asking" @click="ask(t(key))">{{ t(key) }}</button>
          </li>
        </ul>

        <p v-if="askErrorKey" class="error" role="alert">{{ t(askErrorKey) }}</p>

        <div aria-live="polite">
          <p v-if="reply" class="reply">{{ reply }}</p>
          <ul v-if="openSuggestions.length" class="suggestions">
            <li v-for="item in openSuggestions" :key="item.id">
              <div class="change">
                <span class="action">{{ t(`ingredients.ai.action.${item.action}`) }}</span>
                <span :lang="recipeLocale">
                  <s v-if="item.action !== 'add'">{{ rowText(item.rowId) }}</s>
                  <template v-if="item.action === 'replace'"> → </template>
                  <strong v-if="item.action !== 'remove'">{{ item.ingredient }}</strong>
                </span>
              </div>
              <p v-if="item.reason" class="reason">{{ item.reason }}</p>
              <div class="choice">
                <button class="button small" type="button" @click="apply(item)">
                  {{ t('ingredients.ai.apply') }}
                </button>
                <button class="button secondary small" type="button" @click="dismiss(item)">
                  {{ t('ingredients.ai.dismiss') }}
                </button>
              </div>
            </li>
          </ul>
          <button
            v-if="openSuggestions.length > 1"
            class="button secondary small"
            type="button"
            @click="applyAll"
          >
            {{ t('ingredients.ai.applyAll') }}
          </button>
        </div>
        <p class="hint">{{ t('ingredients.ai.disclaimer') }}</p>
      </section>
    </div>

    <p v-if="saveFailed" class="error" role="alert">{{ t('ingredients.error') }}</p>

    <div class="actions">
      <button class="button" type="submit" :disabled="saving">
        {{ saving ? t('ingredients.saving') : t('ingredients.save') }}
      </button>
      <button class="button secondary" type="button" :disabled="saving" @click="emit('cancel')">
        {{ t('ingredients.cancel') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.editor {
  display: grid;
  gap: 1.5rem;
}

.columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.5rem 2.5rem;
  align-items: start;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.rows ul {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.rows li {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

input {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font: inherit;
  background: var(--color-surface);
  color: inherit;
}

input:focus-visible {
  border-color: var(--color-text);
  outline: 1px solid var(--color-text);
  outline-offset: 0;
}

.remove {
  flex: none;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-muted);
  font-size: 1.25rem;
  cursor: pointer;
}

.remove:hover {
  color: var(--color-text);
}

.small {
  padding: 0.4rem 0.85rem;
  font-size: 0.9375rem;
}

.assistant {
  display: grid;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: var(--radius-large);
  background: var(--color-subtle);
}

h3 {
  margin: 0;
  font-size: 1rem;
}

.hint,
.reason {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.875rem;
}

.ask {
  display: flex;
  gap: 0.5rem;
}

.examples {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.examples button {
  padding: 0.25rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: inherit;
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}

.examples button:hover:not(:disabled) {
  border-color: var(--color-text);
}

.examples button:disabled {
  opacity: 0.5;
  cursor: default;
}

.reply {
  margin: 0.25rem 0 0.75rem;
  overflow-wrap: anywhere;
}

.suggestions {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.suggestions li {
  display: grid;
  gap: 0.4rem;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  overflow-wrap: anywhere;
}

.action {
  margin-right: 0.5rem;
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

s {
  color: var(--color-muted);
}

.choice,
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 700px) {
  .columns {
    grid-template-columns: 1fr;
  }
}
</style>
