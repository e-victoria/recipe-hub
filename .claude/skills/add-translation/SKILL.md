---
name: add-translation
description: Add or change user-facing text in the web app across EN, RU and PL. Use whenever UI text is added or edited.
---

# Add a translation

1. Group keys by feature: `recipes.list.empty`, not `emptyText`. Reuse existing keys where the meaning is truly the same.
2. Add the key to `i18n/locales/en.json`, `ru.json` and `pl.json` in the same change. The parity test fails if any file is missing a key.
3. Write natural Russian and Polish, not word-for-word translations. Keep the tone consistent with the existing strings.
4. Use named placeholders (`{count}`, `{name}`), never string concatenation.
5. **Plurals:** Russian and Polish have several plural forms. vue-i18n needs custom plural rules for them, which are not configured yet. If you need a counted string, set that up first rather than faking it with English-style plurals.
6. If you're unsure of a translation, say so in your summary so a speaker can check it.
