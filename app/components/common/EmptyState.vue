<template>
  <section class="py-20 text-center">
    <div class="max-w-6xl mx-auto px-5">
      <h2 class="text-4xl font-light text-black mb-4 tracking-tight">
        <slot name="title">
          {{ title }}
        </slot>
      </h2>
      <p class="text-gray-600 mb-8 text-sm font-light">
        <slot name="description">
          {{ description }}
        </slot>
      </p>
      <slot name="action">
        <NuxtLink 
          :to="actionUrl" 
          class="inline-block bg-black text-white px-6 py-4 text-sm font-light tracking-wide transition-colors hover:bg-gray-800 border border-black"
        >
          {{ actionText }}
        </NuxtLink>
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
// Props 정의
interface Props {
  title?: string
  description?: string
  actionUrl?: string
  actionText?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Not Found',
  description: 'The requested item does not exist or has been removed.',
  actionUrl: '/',
  actionText: 'Go Back'
})
</script>
