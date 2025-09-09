<script setup lang="ts">
const emit = defineEmits<{ (e: 'click'): void }>()
const props = defineProps<{
  label: string
  to: string
  active?: boolean
}>()

const ariaCurrent = computed<'page' | undefined>(() =>
  props.active ? 'page' : undefined
)
</script>

<template>
  <NuxtLink
    :to="props.to"
    :aria-current="ariaCurrent"
    @click="emit('click')"
    class="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors"
    :class="props.active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'"
  >
    {{ props.label }}
  </NuxtLink>
</template>
