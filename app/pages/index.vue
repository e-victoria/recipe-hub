<script setup lang="ts">
const { t } = useI18n()
useHead({ title: () => `${t('home.title')} · ${t('app.name')}` })
</script>

<template>
  <section class="hero">
    <h1>{{ t('home.title') }}</h1>
    <p>{{ t('home.tagline') }}</p>
  </section>
</template>

<style scoped>
.hero {
  padding: 3rem 0;
}

.hero h1 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  line-height: 1.15;
}

.hero p {
  margin: 0;
  color: var(--color-muted);
  font-size: 1.125rem;
}
</style>
