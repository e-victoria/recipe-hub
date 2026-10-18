---
name: add-page
description: Add a new page to the Nuxt web app with EN/RU/PL translations. Use when asked for a new screen, route or page.
---

# Add a page

1. Create `app/pages/<route>.vue`. Nuxt derives the route from the file path, and i18n adds `/ru` and `/pl` variants automatically.
2. In `<script setup>`, use `const { t } = useI18n()` and set the title with `useHead({ title: () => t('<page>.title') })`.
3. Add every new key to all three files in `i18n/locales/` (see the `add-translation` skill).
4. Link to the page with `useLocalePath()`: `<NuxtLink :to="localePath('/<route>')">`.
5. Keep the page server-render safe: browser-only code goes in `onMounted`.
6. Run `npm test` and `npm run build`. Then check `/<route>`, `/ru/<route>` and `/pl/<route>` render the right language.
