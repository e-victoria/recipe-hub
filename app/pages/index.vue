<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { user } = useAuth()
useHead({ title: () => `${t('home.title')} · ${t('app.name')}` })

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
          <NuxtLink v-if="user" class="button primary" :to="localePath('/recipes')">
            {{ t('home.cta.recipes') }}
          </NuxtLink>
          <template v-else>
            <NuxtLink class="button primary" :to="localePath('/register')">{{ t('home.cta.register') }}</NuxtLink>
            <NuxtLink class="button ghost" :to="localePath('/login')">{{ t('home.cta.login') }}</NuxtLink>
          </template>
        </div>
      </div>
      <!-- Photos are decorative: the text next to them says everything. -->
      <img class="hero-image" src="/images/home/hero.webp" alt="" width="960" height="720" fetchpriority="high">
    </section>

    <section class="features" aria-labelledby="features-title">
      <h2 id="features-title">{{ t('home.features.title') }}</h2>
      <ul class="cards">
        <li v-for="feature in features" :key="feature.key" class="card">
          <img :src="feature.image" alt="" width="800" height="600" loading="lazy">
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
      <NuxtLink class="button primary" :to="localePath('/register')">{{ t('home.cta.register') }}</NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: grid;
  gap: 4rem;
  padding: 2.5rem 0 4rem;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2.5rem;
}

.hero h1 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.tagline {
  margin: 0 0 1.75rem;
  color: var(--color-muted);
  font-size: 1.2rem;
  line-height: 1.5;
}

.hero-image {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 24px 48px -24px rgb(43 33 24 / 45%);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.button {
  display: inline-block;
  padding: 0.75rem 1.4rem;
  border: 1px solid transparent;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.button.primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
  box-shadow: 0 8px 20px -10px var(--color-accent);
}

.button.ghost {
  border-color: var(--color-border);
  background: var(--color-surface);
  color: inherit;
}

.button:hover {
  transform: translateY(-1px);
}

.button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

.features h2,
.closing h2 {
  margin: 0 0 1.5rem;
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  letter-spacing: -0.01em;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
}

.card img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.card-body {
  padding: 1.1rem 1.25rem 1.4rem;
}

.card h3 {
  margin: 0 0 0.4rem;
  font-size: 1.125rem;
}

.card p {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.5;
}

.closing {
  padding: 2.5rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: var(--color-surface);
  text-align: center;
}

.closing h2 {
  margin-bottom: 0.5rem;
}

.closing p {
  margin: 0 0 1.5rem;
  color: var(--color-muted);
}

@media (max-width: 760px) {
  .home {
    gap: 3rem;
    padding-top: 1.5rem;
  }

  .hero {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .cards {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}
</style>
