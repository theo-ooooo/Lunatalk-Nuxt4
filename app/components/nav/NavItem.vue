<script setup lang="ts">
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
    class="relative text-sm font-medium tracking-wide transition-colors"
    :class="props.active ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'"
  >
    {{ props.label }}
    <span
      class="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded bg-gray-900 transition-transform duration-200"
      :class="props.active ? 'scale-x-100' : 'group-hover:scale-x-100'"
    />
  </NuxtLink>
</template>
