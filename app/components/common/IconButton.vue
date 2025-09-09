<script setup lang="ts">
const props = withDefaults(defineProps<{
  to: string
  ariaLabel?: string
}>(), { ariaLabel: '' })
</script>

<template>
  <NuxtLink
    :to="props.to"
    :aria-label="props.ariaLabel"
    class="inline-flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
  >
    <slot />
  </NuxtLink>
</template>
