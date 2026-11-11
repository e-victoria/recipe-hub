<script setup lang="ts">
defineProps<{ disabled?: boolean, coverHint?: boolean }>()
const files = defineModel<File[]>({ required: true })

const { t } = useI18n()
const rejected = ref<{ name: string, key: string }[]>([])
const acceptedTypes = [...IMAGE_TYPES, ...VIDEO_TYPES].join(',')

function addFiles(event: Event) {
  const input = event.target as HTMLInputElement
  const picked = [...(input.files ?? [])]
  rejected.value = picked.flatMap((file) => {
    const key = mediaProblem(file)
    return key ? [{ name: file.name, key }] : []
  })
  files.value = [...files.value, ...picked.filter((file) => !mediaProblem(file))]
  // So picking the same file again after removing it still fires a change event.
  input.value = ''
}

function remove(index: number) {
  files.value = files.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="media">
    <label class="field">
      <span>{{ t('media.field') }}</span>
      <input type="file" multiple :accept="acceptedTypes" :disabled="disabled" @change="addFiles" />
      <small>{{ t('media.hint') }}</small>
      <small v-if="coverHint">{{ t('media.coverHint') }}</small>
    </label>
    <ul v-if="rejected.length" class="rejected" role="alert">
      <li v-for="item in rejected" :key="item.name">{{ t(item.key, { name: item.name }) }}</li>
    </ul>
    <ul v-if="files.length" class="files">
      <li v-for="(file, index) in files" :key="index">
        <span class="file-name">{{ file.name }}</span>
        <button
          class="remove"
          type="button"
          :disabled="disabled"
          :aria-label="t('media.remove', { name: file.name })"
          @click="remove(index)"
        >
          ×
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.media {
  display: grid;
  gap: 0.5rem;
}

.field input {
  padding: 0.45rem;
  font-size: 0.9375rem;
}

.field input::file-selector-button {
  margin-right: 0.75rem;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 7px;
  background: var(--color-surface);
  color: inherit;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}

.rejected {
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--color-danger);
  font-size: 0.9375rem;
  overflow-wrap: anywhere;
}

.files {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.9375rem;
}

.files li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.15rem 0;
  border-bottom: 1px solid var(--color-border);
}

.file-name {
  overflow-wrap: anywhere;
}

.remove {
  flex: none;
  width: 2rem;
  height: 2rem;
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
</style>
