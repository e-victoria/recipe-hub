<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
useHead({ title: () => `${t('recipeNew.title')} · ${t('app.name')}` })
</script>

<template>
  <section class="recipe-new">
    <NuxtLink class="back" :to="localePath('/recipes')">← {{ t('recipeNew.back') }}</NuxtLink>
    <h1>{{ t('recipeNew.title') }}</h1>
    <p>{{ t('recipeNew.comingSoon') }}</p>
  </section>
</template>

<style scoped>
.recipe-new {
  padding: 2rem 0;
}

.back {
  color: var(--color-muted);
  text-decoration: none;
}

.recipe-new h1 {
  margin: 1rem 0 0.5rem;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
}

.recipe-new p {
  margin: 0;
  color: var(--color-muted);
}
</style>
