<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { user } = useAuth()
useHead({
  title: () => `${t('home.title')} · ${t('app.name')}`,
  // The hero photo is the largest thing on the page: start fetching it before the CSS is parsed.
  link: [{ rel: 'preload', as: 'image', href: '/images/home/hero.webp', type: 'image/webp', fetchpriority: 'high' }],
})

const features = [
  { key: 'save', image: '/images/home/save.webp' },
  { key: 'nutrition', image: '/images/home/nutrition.webp' },
  { key: 'plan', image: '/images/home/plan.webp' },
] as const
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-text">
        <h1>{{ t('home.title') }}</h1>
        <p class="tagline">{{ t('home.tagline') }}</p>
        <div class="actions">
          <NuxtLink v-if="user" class="button" :to="localePath('/recipes')">
            {{ t('home.cta.recipes') }}
          </NuxtLink>
          <template v-else>
            <NuxtLink class="button" :to="localePath('/register')">{{ t('home.cta.register') }}</NuxtLink>
            <NuxtLink class="button secondary" :to="localePath('/login')">{{ t('home.cta.login') }}</NuxtLink>
          </template>
        </div>
      </div>
      <!-- Photos are decorative: the text next to them says everything. -->
      <img class="hero-image" src="/images/home/hero.webp" alt="" width="960" height="720" fetchpriority="high" decoding="async">
    </section>

    <section class="features" aria-labelledby="features-title">
      <h2 id="features-title">{{ t('home.features.title') }}</h2>
      <ul class="cards">
        <li v-for="feature in features" :key="feature.key" class="card">
          <img :src="feature.image" alt="" width="800" height="600" loading="lazy" decoding="async">
          <div class="card-body">
            <h3>{{ t(`home.features.${feature.key}.title`) }}</h3>
            <p>{{ t(`home.features.${feature.key}.text`) }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section v-if="!user" class="closing">
      <h2>{{ t('home.closing.title') }}</h2>
      <p>{{ t('home.closing.text') }}</p>
      <NuxtLink class="button" :to="localePath('/register')">{{ t('home.cta.register') }}</NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: grid;
  gap: 5rem;
  padding: 4rem 0 5rem;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 3.5rem;
}

.hero h1 {
  margin: 0 0 1.25rem;
  font-size: clamp(2.125rem, 5vw, 3.25rem);
  line-height: 1.08;
  letter-spacing: -0.035em;
  text-wrap: balance;
}

.tagline {
  max-width: 28rem;
  margin: 0 0 2rem;
  color: var(--color-muted);
  font-size: 1.125rem;
  line-height: 1.55;
}

.hero-image {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-large);
  object-fit: cover;
  background: var(--color-subtle);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.actions .button,
.closing .button {
  padding: 0.7rem 1.4rem;
}

.features h2,
.closing h2 {
  margin: 0 0 2rem;
  font-size: clamp(1.375rem, 3vw, 1.75rem);
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-large);
  object-fit: cover;
  background: var(--color-subtle);
}

.card-body {
  padding-top: 1rem;
}

.card h3 {
  margin: 0 0 0.35rem;
  font-size: 1.0625rem;
  letter-spacing: -0.01em;
}

.card p {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9375rem;
  line-height: 1.55;
}

.closing {
  padding-top: 4rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.closing h2 {
  margin-bottom: 0.5rem;
}

.closing p {
  margin: 0 0 1.75rem;
  color: var(--color-muted);
}

@media (max-width: 760px) {
  .home {
    gap: 3.5rem;
    padding: 2rem 0 3.5rem;
  }

  .hero {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
