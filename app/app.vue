<script setup lang="ts">
const head = useLocaleHead()
</script>

<template>
  <Html :lang="head.htmlAttrs?.lang">
    <Head>
      <template v-for="link in head.link" :key="link.key">
        <Link :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
      </template>
    </Head>
    <Body>
      <NuxtRouteAnnouncer />
      <VitePwaManifest />
      <AppHeader />
      <main class="content">
        <NuxtPage />
      </main>
    </Body>
  </Html>
</template>
