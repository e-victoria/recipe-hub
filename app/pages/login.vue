<script setup lang="ts">
const { t } = useI18n()
useHead({ title: () => `${t('auth.login.title')} · ${t('app.name')}` })
</script>

<template>
  <AuthForm mode="login" />
</template>
