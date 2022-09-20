<script lang="ts" setup>
import '@fontsource/work-sans'
import './assets/css/tailwind.css'
import './assets/css/index.css'

definePageMeta({
  colorMode: 'light',
})
</script>

<template>
  <NuxtLayout class="antialiased">
    <AlertList />
    <NuxtPage />
  </NuxtLayout>
</template>
