<script setup lang="ts">
const props = defineProps<{ slug: string, coverHint: boolean }>()
const emit = defineEmits<{ uploaded: [] }>()

const { t } = useI18n()
const mediaApi = useMediaApi()

const files = ref<File[]>([])
const total = ref(0)
const current = ref<number | null>(null)
const failed = ref(false)

async function upload() {
  total.value = files.value.length
  failed.value = false
  // Failed files stay listed: the recipe already exists, so trying again is safe.
  const remaining = await uploadMedia(files.value, mediaApi(props.slug), (index) => {
    current.value = index
  })
  files.value = remaining
  failed.value = remaining.length > 0
  current.value = null
  if (remaining.length < total.value) {
    emit('uploaded')
  }
}
</script>

<template>
  <section class="media-upload">
    <h2>{{ t('recipe.addMedia') }}</h2>
    <form class="form" @submit.prevent="upload">
      <MediaPicker v-model="files" :disabled="current !== null" :cover-hint="coverHint" />
      <p v-if="failed" class="error" role="alert">{{ t('recipe.uploadFailed') }}</p>
      <div>
        <button class="button" type="submit" :disabled="!files.length || current !== null">
          {{ current ? t('media.uploading', { current, total }) : t('recipe.upload') }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.media-upload {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

h2 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
}

.form {
  display: grid;
  gap: 1rem;
  max-width: 640px;
}

.error {
  margin: 0;
  color: #b3261e;
}

.button {
  padding: 0.6rem 1.1rem;
  border: 0;
  border-radius: 8px;
  background: var(--color-text);
  color: var(--color-bg);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.button:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>
