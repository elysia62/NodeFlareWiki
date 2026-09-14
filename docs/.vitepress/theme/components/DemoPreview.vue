<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  src: string
  alt?: string
  href: string
  badge?: string
}>()
</script>

<template>
  <!-- The demo is a standalone app; target bypasses VitePress routing. -->
  <a class="demo-preview" :href="withBase(href)" target="_self">
    <img :src="withBase(src)" :alt="alt" />
    <span class="demo-preview-badge">▶ {{ badge }}</span>
  </a>
</template>
