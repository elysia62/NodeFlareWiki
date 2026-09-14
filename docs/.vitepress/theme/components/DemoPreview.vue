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
  <a class="demo-preview" :href="withBase(href)">
    <img :src="withBase(src)" :alt="alt" />
    <span class="demo-preview-badge">▶ {{ badge }}</span>
  </a>
</template>
