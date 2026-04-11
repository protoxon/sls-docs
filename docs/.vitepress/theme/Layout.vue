<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import HomeGitHubStar from './components/HomeGitHubStar.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-actions-after>
      <HomeGitHubStar />
    </template>
    <template #layout-bottom>
      <SiteFooter />
    </template>
  </DefaultTheme.Layout>
</template>
