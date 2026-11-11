<script setup lang="ts">
const { t } = useI18n()
useHead({ title: () => `${t('auth.register.title')} · ${t('app.name')}` })
</script>

<template>
  <AuthForm mode="register" />
</template>
